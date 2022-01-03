import { Location } from '../location';
import { HandlingEvent, HandlingEventType } from '../handling';
import { Validate } from '../../helpers/validate.helper';
import { IValueObject } from '../../types/value-object.interface';
import { Leg } from './leg.model';

/**
 * An itinerary
 */
export class Itinerary implements IValueObject<Itinerary> {
  readonly #legs: Leg[] = [];

  static EMPTY_ITINERARY = Itinerary.buildEmpty();

  private static END_OF_DAYS = new Date(24 * 60 * 60 * 10 ** 11);

  private constructor(legs: Leg[]) {
    this.#legs = legs;
  }

  /**
   * @return the legs of this itinerary, as an <b>immutable</b> list.
   */
  get legs(): Leg[] {
    // TODO immutable
    return this.#legs;
  }

  /**
   * Test if the given handling event is expected when executing this itinerary.
   *
   * @param event Event to test.
   * @return <code>true</code> if the event is expected
   */
  public isExpected(event: HandlingEvent): boolean {
    if (this.legsIsEmpty()) return true;

    if (event.type === HandlingEventType.RECEIVE) {
      // Check that the first leg's origin is the event's location
      const leg: Leg = this.#legs[0];
      return leg.loadLocation.equals(event.location);
    }

    if (event.type === HandlingEventType.LOAD) {
      // Check that the there is one leg with same load location and voyage
      return this.#legs.some(
        (leg) =>
          leg.loadLocation.sameIdentityAs(event.location) &&
          leg.voyage.sameIdentityAs(event.voyage),
      );
    }

    if (event.type === HandlingEventType.UNLOAD) {
      // Check that the there is one leg with same unload location and voyage
      return this.#legs.some(
        (leg) =>
          leg.unloadLocation.sameIdentityAs(event.location) &&
          leg.voyage.sameIdentityAs(event.voyage),
      );
    }

    if (event.type === HandlingEventType.CLAIM) {
      // Check that the last leg's destination is from the event's location
      return this.getLastLeg().unloadLocation.equals(event.location);
    }

    // HandlingEvent.Type.CUSTOMS;
    return true;
  }

  /**
   * @return The initial departure location.
   */
  initialDepartureLocation(): Location {
    return this.legsIsEmpty() ? Location.UNKNOWN : this.legs[0].loadLocation;
  }

  /**
   * @return The final arrival location.
   */
  finalArrivalLocation(): Location {
    return this.legsIsEmpty() ? Location.UNKNOWN : this.getLastLeg().unloadLocation;
  }

  /**
   * @return Date when cargo arrives at final destination.
   */
  finalArrivalDate(): Date {
    const lastLeg: Leg = this.getLastLeg();
    const date = lastLeg === null ? Itinerary.END_OF_DAYS : lastLeg.unloadTime;

    return new Date(date);
  }

  legsIsEmpty(): boolean {
    return this.#legs.length === 0;
  }

  getFirstLeg(): Leg | null {
    return this.legsIsEmpty() ? null : this.#legs[0];
  }

  /**
   * @return The last leg on the itinerary.
   */
  getLastLeg(): Leg | null {
    if (this.legsIsEmpty()) return null;
    const lastIndex = this.#legs.length - 1;

    return this.#legs[lastIndex];
  }

  /**
   * @param other itinerary to compare
   * @return true if the legs in this and the other itinerary are all equal.
   */
  sameValueAs(other: Itinerary): boolean {
    if (!other) return false;
    if (this.#legs.length !== other.#legs.length) return false;
    return this.#legs.every((leg, index) => leg === other.#legs[index]);
  }

  equals(itinerary: object): boolean {
    if (this === itinerary) return true;
    if (!itinerary || !(itinerary instanceof Itinerary)) return false;

    return this.sameValueAs(itinerary);
  }

  static build(legs: Leg[]) {
    Validate.notEmpty(legs);
    Validate.noNilElements(legs);
    return new Itinerary(legs);
  }

  private static buildEmpty() {
    return new Itinerary([]);
  }
}
