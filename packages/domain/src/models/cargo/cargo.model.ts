import { Location } from '../location';
import { IEntity } from '../../types/entity.interface';
import { Validate } from '../../helpers/validate.helper';
import { nullSafe } from '../../helpers/null-safe.helper';
import { HandlingHistory } from '../handling/handling-history';
import { HashCodeBuilder } from '../../helpers/hash-code.builder';
import { Delivery, Itinerary, TrackingId, RouteSpecification } from '.';

/**
 * A Cargo. This is the central class in the domain model,
 * and it is the root of the Cargo-Itinerary-Leg-Delivery-RouteSpecification aggregate.
 *
 * A cargo is identified by a unique tracking id, and it always has an origin
 * and a route specification. The life cycle of a cargo begins with the booking procedure,
 * when the tracking id is assigned. During a (short) period of time, between booking
 * and initial routing, the cargo has no itinerary.
 *
 * The booking clerk requests a list of possible routes, matching the route specification,
 * and assigns the cargo to one route. The route to which a cargo is assigned is described
 * by an itinerary.
 *
 * A cargo can be re-routed during transport, on demand of the customer, in which case
 * a new route is specified for the cargo and a new route is requested. The old itinerary,
 * being a value object, is discarded and a new one is attached.
 *
 * It may also happen that a cargo is accidentally misrouted, which should notify the proper
 * personnel and also trigger a re-routing procedure.
 *
 * When a cargo is handled, the status of the delivery changes. Everything about the delivery
 * of the cargo is contained in the Delivery value object, which is replaced whenever a cargo
 * is handled by an asynchronous event triggered by the registration of the handling event.
 *
 * The delivery can also be affected by routing changes, i.e. when the route specification
 * changes, or the cargo is assigned to a new route. In that case, the delivery update is performed
 * synchronously within the cargo aggregate.
 *
 * The life cycle of a cargo ends when the cargo is claimed by the customer.
 *
 * The cargo aggregate, and the entire domain model, is built to solve the problem
 * of booking and tracking cargo. All important business rules for determining whether
 * or not a cargo is misdirected, what the current status of the cargo is (on board carrier,
 * in port etc), are captured in this aggregate.
 *
 */
export class Cargo implements IEntity<Cargo> {
  readonly #trackingId: TrackingId;
  readonly #origin: Location;
  #routeSpecification: RouteSpecification;
  #itinerary: Itinerary;
  #delivery: Delivery;

  constructor(trackingId: TrackingId, routeSpecification: RouteSpecification) {
    Validate.notNil(trackingId, 'Tracking ID is required');
    Validate.notNil(routeSpecification, 'Route specification is required');

    this.#trackingId = trackingId;
    // Cargo origin never changes, even if the route specification changes.
    // However, at creation, cargo orgin can be derived from the initial route specification.
    this.#origin = routeSpecification.origin;
    this.#routeSpecification = routeSpecification;

    this.#delivery = Delivery.derivedFrom(
      this.routeSpecification,
      this.#itinerary,
      HandlingHistory.EMPTY,
    );
  }

  /**
   * The tracking id is the identity of this entity, and is unique.
   *
   * @return Tracking id.
   */
  get trackingId() {
    return this.#trackingId;
  }

  get origin(): Location {
    return this.#origin;
  }

  get delivery(): Delivery {
    return this.#delivery;
  }

  get itinerary(): Itinerary {
    return nullSafe(this.#itinerary, Itinerary.EMPTY_ITINERARY);
  }

  get routeSpecification(): RouteSpecification {
    return this.#routeSpecification;
  }

  specifyNewRoute(routeSpecification: RouteSpecification): void {
    Validate.notNull(routeSpecification, 'Route specification is required');

    this.#routeSpecification = routeSpecification;
    // Handling consistency within the Cargo aggregate synchronously
    this.#delivery = this.#delivery.updateOnRouting(this.#routeSpecification, this.#itinerary);
  }

  /**
   * Attach a new itinerary to this cargo.
   *
   * @param itinerary an itinerary. May not be null.
   */
  assignToRoute(itinerary: Itinerary): void {
    Validate.notNil(itinerary, 'Itinerary is required for assignment');

    this.#itinerary = itinerary;
    // Handling consistency within the Cargo aggregate synchronously
    this.#delivery = this.#delivery.updateOnRouting(this.#routeSpecification, this.#itinerary);
  }

  /**
   * Updates all aspects of the cargo aggregate status
   * based on the current route specification, itinerary and handling of the cargo.
   * <p/>
   * When either of those three changes, i.e. when a new route is specified for the cargo,
   * the cargo is assigned to a route or when the cargo is handled, the status must be
   * re-calculated.
   * <p/>
   * {@link RouteSpecification} and {@link Itinerary} are both inside the Cargo
   * aggregate, so changes to them cause the status to be updated <b>synchronously</b>,
   * but changes to the delivery history (when a cargo is handled) cause the status update
   * to happen <b>asynchronously</b> since {@link HandlingEvent} is in a different aggregate.
   *
   * @param handlingHistory handling history
   */
  deriveDeliveryProgress(handlingHistory: HandlingHistory): void {
    // TODO filter events on cargo (must be same as this cargo)

    // Delivery is a value object, so we can simply discard the old one
    // and replace it with a new
    this.#delivery = Delivery.derivedFrom(
      this.#routeSpecification,
      this.itinerary,
      handlingHistory,
    );
  }

  public sameIdentityAs(other: Cargo): boolean {
    return other && this.#trackingId.sameValueAs(other.trackingId);
  }

  /**
   * @param other to compare
   * @return True if they have the same identity
   * @see #sameIdentityAs(Cargo)
   */
  equals(other: object) {
    if (this === other) return true;
    if (!other || !(other instanceof Cargo)) return false;

    return this.sameIdentityAs(other);
  }

  public toString(): string {
    return this.#trackingId.toString();
  }

  hashCode(): number {
    return HashCodeBuilder.hashCodeForString(this.toString());
  }
}
