import { Voyage } from '../voyage/voyage.model';
import { Location } from '../location';
import { HandlingEvent, HandlingEventType } from '../handling';
import { HandlingHistory } from '../handling/handling-history';
import { IValueObject } from '../../types/value-object.interface';
import { Validate } from '../../helpers/validate.helper';
import { nullSafe } from '../../helpers/null-safe.helper';
import { EqualsBuilder } from '../../helpers/equals.builder';
import { RouteSpecification } from './route.specification';
import { HandlingActivity } from './handling-activity.model';
import { TransportStatus } from './transport-status';
import { RoutingStatus } from './routing-status';
import { Itinerary } from './itinerary.model';
import { Leg } from './leg.model';

const { NOT_RECEIVED, IN_PORT, CLAIMED, ONBOARD_CARRIER, UNKNOWN } = TransportStatus;

/**
 * The actual transportation of the cargo, as opposed to
 * the customer requirement (RouteSpecification) and the plan (Itinerary).
 *
 */
export class Delivery implements IValueObject<Delivery> {
  readonly #transportStatus: TransportStatus;

  readonly #lastKnownLocation: Location;

  readonly #currentVoyage: Voyage;

  readonly #misdirected: boolean;

  readonly #eta: Date;

  readonly #nextExpectedActivity: HandlingActivity;

  readonly #isUnloadedAtDestination: boolean;

  readonly #routingStatus: RoutingStatus;

  readonly #calculatedAt: Date;

  readonly #lastEvent: HandlingEvent;

  private static ETA_UNKNOWN: Date = null;

  private static NO_ACTIVITY: HandlingActivity = null;

  /**
   * Creates a new delivery snapshot to reflect changes in routing, i.e.
   * when the route specification or the itinerary has changed
   * but no additional handling of the cargo has been performed.
   *
   * @param routeSpecification route specification
   * @param itinerary itinerary
   * @return An up to date delivery
   */
  updateOnRouting(routeSpecification: RouteSpecification, itinerary: Itinerary): Delivery {
    Validate.notNull(routeSpecification, 'Route specification is required');

    return new Delivery(this.#lastEvent, itinerary, routeSpecification);
  }

  /**
   * Creates a new delivery snapshot based on the complete handling history of a cargo,
   * as well as its route specification and itinerary.
   *
   * @param routeSpecification route specification
   * @param itinerary itinerary
   * @param handlingHistory delivery history
   * @return An up to date delivery.
   */
  static derivedFrom(
    routeSpecification: RouteSpecification,
    itinerary: Itinerary,
    handlingHistory: HandlingHistory,
  ): Delivery {
    Validate.notNull(routeSpecification, 'Route specification is required');
    Validate.notNull(handlingHistory, 'Delivery history is required');

    const lastEvent = handlingHistory.mostRecentlyCompletedEvent();

    return new Delivery(lastEvent, itinerary, routeSpecification);
  }

  /**
   * Internal constructor.
   *
   * @param lastEvent last event
   * @param itinerary itinerary
   * @param routeSpecification route specification
   */
  private constructor(
    lastEvent: HandlingEvent,
    itinerary: Itinerary,
    routeSpecification: RouteSpecification,
  ) {
    this.#calculatedAt = new Date();
    this.#lastEvent = lastEvent;

    this.#misdirected = this.calculateMisdirectionStatus(itinerary);
    this.#routingStatus = this.calculateRoutingStatus(itinerary, routeSpecification);
    this.#transportStatus = this.calculateTransportStatus();
    this.#lastKnownLocation = this.calculateLastKnownLocation();
    this.#currentVoyage = this.calculateCurrentVoyage();
    this.#eta = this.calculateEta(itinerary);
    this.#nextExpectedActivity = this.calculateNextExpectedActivity(routeSpecification, itinerary);
    this.#isUnloadedAtDestination = this.calculateUnloadedAtDestination(routeSpecification);
  }

  /**
   * @return Transport status
   */
  public get transportStatus(): TransportStatus {
    return this.#transportStatus;
  }

  /**
   * @return Last known location of the cargo, or Location.UNKNOWN if the delivery history is empty.
   */
  public get lastKnownLocation(): Location {
    return nullSafe(this.#lastKnownLocation, Location.UNKNOWN);
  }

  /**
   * @return Current voyage.
   */
  public get currentVoyage(): Voyage {
    return nullSafe(this.#currentVoyage, Voyage.NONE);
  }

  /**
   * Check if cargo is misdirected.
   * <p/>
   * <ul>
   * <li>A cargo is misdirected if it is in a location that's not in the itinerary.
   * <li>A cargo with no itinerary can not be misdirected.
   * <li>A cargo that has received no handling events can not be misdirected.
   * </ul>
   *
   * @return <code>true</code> if the cargo has been misdirected,
   */
  public get isMisdirected(): boolean {
    return this.#misdirected;
  }

  /**
   * @return Estimated time of arrival
   */
  public get estimatedTimeOfArrival(): Date {
    if (this.#eta !== Delivery.ETA_UNKNOWN) {
      return new Date(this.#eta);
    }
    return Delivery.ETA_UNKNOWN;
  }

  /**
   * @return The next expected handling activity.
   */
  public get nextExpectedActivity(): HandlingActivity {
    return this.#nextExpectedActivity;
  }

  /**
   * @return True if the cargo has been unloaded at the final destination.
   */
  public get isUnloadedAtDestination(): boolean {
    return this.#isUnloadedAtDestination;
  }

  /**
   * @return Routing status.
   */
  public get routingStatus(): RoutingStatus {
    return this.#routingStatus;
  }

  /**
   * @return When this delivery was calculated.
   */
  public get calculatedAt(): Date {
    return new Date(this.#calculatedAt);
  }

  // TODO add currentCarrierMovement (?)

  // --- Internal calculations below ---

  private calculateTransportStatus(): TransportStatus {
    if (this.#lastEvent === null) {
      return NOT_RECEIVED;
    }

    switch (this.#lastEvent.type) {
      case HandlingEventType.LOAD:
        return ONBOARD_CARRIER;
      case HandlingEventType.UNLOAD:
      case HandlingEventType.RECEIVE:
      case HandlingEventType.CUSTOMS:
        return IN_PORT;
      case HandlingEventType.CLAIM:
        return CLAIMED;
      default:
        return UNKNOWN;
    }
  }

  private calculateLastKnownLocation(): Location {
    return this.#lastEvent ? this.#lastEvent.location : null;
  }

  private calculateCurrentVoyage(): Voyage {
    if (this.transportStatus.equals(ONBOARD_CARRIER) && this.#lastEvent) {
      return this.#lastEvent.voyage;
    }

    return null;
  }

  private calculateMisdirectionStatus(itinerary: Itinerary): boolean {
    return this.#lastEvent ? !itinerary.isExpected(this.#lastEvent) : false;
  }

  private calculateEta(itinerary: Itinerary): Date {
    if (this.onTrack()) {
      return itinerary.finalArrivalDate();
    }
    return Delivery.ETA_UNKNOWN;
  }

  private calculateNextExpectedActivity(
    routeSpecification: RouteSpecification,
    itinerary: Itinerary,
  ): HandlingActivity {
    if (!this.onTrack()) return Delivery.NO_ACTIVITY;

    if (!this.#lastEvent)
      return new HandlingActivity(HandlingEventType.RECEIVE, routeSpecification.origin);

    switch (this.#lastEvent.type) {
      case HandlingEventType.LOAD: {
        const leg = itinerary.legs.find((l: Leg) =>
          l.loadLocation.sameIdentityAs(this.#lastEvent.location),
        );
        if (leg)
          return new HandlingActivity(HandlingEventType.UNLOAD, leg.unloadLocation, leg.voyage);
        return Delivery.NO_ACTIVITY;
      }
      case HandlingEventType.UNLOAD: {
        // for (const it = itinerary.legs.values(); it.hasNext(); ) {
        //   const currentLeg: Leg = it.next();
        //   if (currentLeg.unloadLocation.sameIdentityAs(this.#lastEvent.location)) {
        //     if (it.hasNext()) {
        //       const nextLeg: Leg = it.next();
        //       return new HandlingActivity(HandlingEventType.LOAD, nextLeg.loadLocation, nextLeg.voyage);
        //     } else {
        //       return new HandlingActivity(HandlingEventType.CLAIM, currentLeg.unloadLocation);
        //     }
        //   }
        // }

        const legsCount = itinerary.legs.length;
        for (let i = 0; i < legsCount; i += 1) {
          const currentLeg: Leg = itinerary.legs[i];
          if (currentLeg.unloadLocation.sameIdentityAs(this.#lastEvent.location)) {
            if (i < legsCount - 1) {
              const nextLeg: Leg = itinerary.legs[i + 1];
              return new HandlingActivity(
                HandlingEventType.LOAD,
                nextLeg.loadLocation,
                nextLeg.voyage,
              );
            }
            return new HandlingActivity(HandlingEventType.CLAIM, currentLeg.unloadLocation);
          }
        }

        return Delivery.NO_ACTIVITY;
      }
      case HandlingEventType.RECEIVE: {
        const firstLeg: Leg = itinerary.legs[0];
        return new HandlingActivity(HandlingEventType.LOAD, firstLeg.loadLocation, firstLeg.voyage);
      }

      case HandlingEventType.CLAIM:
      default:
        return Delivery.NO_ACTIVITY;
    }
  }

  // noinspection JSMethodCanBeStatic
  private calculateRoutingStatus(
    itinerary: Itinerary,
    routeSpecification: RouteSpecification,
  ): RoutingStatus {
    if (!itinerary) {
      return RoutingStatus.NOT_ROUTED;
    }

    if (routeSpecification.isSatisfiedBy(itinerary)) {
      return RoutingStatus.ROUTED;
    }

    return RoutingStatus.MISROUTED;
  }

  private calculateUnloadedAtDestination(routeSpecification: RouteSpecification): boolean {
    return (
      this.#lastEvent &&
      HandlingEventType.UNLOAD.sameValueAs(this.#lastEvent.type) &&
      routeSpecification.destination.sameIdentityAs(this.#lastEvent.location)
    );
  }

  private onTrack(): boolean {
    return this.#routingStatus.equals(RoutingStatus.ROUTED) && !this.#misdirected;
  }

  public sameValueAs(other: Delivery): boolean {
    if (!other) return false;
    return new EqualsBuilder()
      .append(this.transportStatus, other.transportStatus)
      .append(this.lastKnownLocation, other.lastKnownLocation)
      .append(this.currentVoyage, other.currentVoyage)
      .append(this.#misdirected, other.#misdirected)
      .append(this.#eta, other.#eta)
      .append(this.nextExpectedActivity, other.nextExpectedActivity)
      .append(this.isUnloadedAtDestination, other.isUnloadedAtDestination)
      .append(this.routingStatus, other.routingStatus)
      .append(this.calculatedAt, other.calculatedAt)
      .append(this.#lastEvent, other.#lastEvent)
      .isEquals();
  }

  public equals(other: object): boolean {
    if (this === other) return true;
    if (!other || !(other instanceof Delivery)) return false;

    return this.sameValueAs(other);
  }
}
