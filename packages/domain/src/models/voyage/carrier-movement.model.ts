import { IValueObject } from '../../types/value-object.interface';
import { Location } from '../location';
import { Validate } from '../../helpers/validate.helper';
import { EqualsBuilder } from '../../helpers/equals.builder';

/**
 * A carrier movement is a vessel voyage from one location to another
 */
export class CarrierMovement implements IValueObject<CarrierMovement> {
  readonly #departureLocation: Location;

  readonly #arrivalLocation: Location;

  readonly #departureTime: Date;

  readonly #arrivalTime: Date;

  // Null object pattern
  public static readonly NONE: CarrierMovement = new CarrierMovement(
    Location.UNKNOWN,
    Location.UNKNOWN,
    new Date(0),
    new Date(0),
  );

  /**
   * Constructor.
   *
   * @param departureLocation location of departure
   * @param arrivalLocation location of arrival
   * @param departureTime time of departure
   * @param arrivalTime time of arrival
   */
  // TODO make package local
  constructor(
    departureLocation: Location,
    arrivalLocation: Location,
    departureTime: Date,
    arrivalTime: Date,
  ) {
    Validate.noNilElements([departureLocation, arrivalLocation, departureTime, arrivalTime]);
    this.#departureTime = departureTime;
    this.#arrivalTime = arrivalTime;
    this.#departureLocation = departureLocation;
    this.#arrivalLocation = arrivalLocation;
  }

  /**
   * @return Departure location.
   */
  public get departureLocation(): Location {
    return this.#departureLocation;
  }

  /**
   * @return Arrival location.
   */
  public get arrivalLocation(): Location {
    return this.#arrivalLocation;
  }

  /**
   * @return Time of departure.
   */
  public get departureTime(): Date {
    return new Date(this.#departureTime);
  }

  /**
   * @return Time of arrival.
   */
  public get arrivalTime(): Date {
    return new Date(this.#arrivalTime);
  }

  public equals(that: object): boolean {
    if (this === that) return true;
    if (!that || !(that instanceof CarrierMovement)) return false;

    return this.sameValueAs(that);
  }

  public sameValueAs(other: CarrierMovement): boolean {
    if (!other) return false;
    return new EqualsBuilder()
      .append(this.departureLocation, other.departureLocation)
      .append(this.departureTime, other.departureTime)
      .append(this.arrivalLocation, other.arrivalLocation)
      .append(this.arrivalTime, other.arrivalTime)
      .isEquals();
  }
}
