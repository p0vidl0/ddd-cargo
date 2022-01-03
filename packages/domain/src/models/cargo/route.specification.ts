import { Location } from '../location';
import { IValueObject } from '../../types/value-object.interface';
import { AbstractSpecification } from '../../specifications/abstract.specification';
import { Itinerary } from './itinerary.model';

/**
 * Route specification. Describes where a cargo origin and destination is,
 * and the arrival deadline.
 */
export class RouteSpecification
  extends AbstractSpecification<Itinerary>
  implements IValueObject<RouteSpecification>
{
  readonly #origin: Location;
  readonly #destination: Location;
  readonly #arrivalDeadline: Date;

  /**
   * @param origin origin location - can't be the same as the destination
   * @param destination destination location - can't be the same as the origin
   * @param arrivalDeadline arrival deadline
   */
  constructor(origin: Location, destination: Location, arrivalDeadline: Date) {
    super();
    // TODO validate with exception
    // Validate.notNull(origin, "Origin is required");
    // Validate.notNull(destination, "Destination is required");
    // Validate.notNull(arrivalDeadline, "Arrival deadline is required");
    // Validate.isTrue(!origin.sameIdentityAs(destination), "Origin and destination can't be the same: " + origin);

    this.#origin = origin;
    this.#destination = destination;
    this.#arrivalDeadline = new Date(arrivalDeadline);
  }

  /**
   * @return Specified origin location.
   */
  get origin() {
    return this.#origin;
  }

  /**
   * @return Specfied destination location.
   */
  get destination() {
    return this.#destination;
  }

  /**
   * @return Arrival deadline.
   */
  get arrivalDeadline() {
    return new Date(this.#arrivalDeadline);
  }

  isSatisfiedBy(itinerary: Itinerary): boolean {
    return (
      itinerary != null &&
      this.origin.sameIdentityAs(itinerary.initialDepartureLocation()) &&
      this.destination.sameIdentityAs(itinerary.finalArrivalLocation()) &&
      this.arrivalDeadline.getTime() > itinerary.finalArrivalDate().getTime()
    ); // TODO use Date-fns or MomentJS
  }

  sameValueAs(other: RouteSpecification): boolean {
    return (
      other != null &&
      this.origin.equals(other.origin) &&
      this.destination.equals(other.destination) &&
      this.arrivalDeadline.getTime() === other.arrivalDeadline.getTime()
    ); // TODO use Date-fns or MomentJS;
  }

  equals(that: object): boolean {
    if (this === that) return true;
    if (that == null || !(that instanceof RouteSpecification)) return false;

    return this.sameValueAs(that);
  }
}
