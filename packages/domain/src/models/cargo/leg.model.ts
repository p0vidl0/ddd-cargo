import { Location } from '../location';
import { Voyage } from '../voyage/voyage.model';
import { IValueObject } from '../../types/value-object.interface';
import { Validate } from '../../helpers/validate.helper';

/**
 * An itinerary consists of one or more legs.
 */
export class Leg implements IValueObject<Leg> {
  readonly #voyage: Voyage;
  readonly #loadTime: Date;
  readonly #unloadTime: Date;
  readonly #loadLocation: Location;
  readonly #unloadLocation: Location;

  constructor(
    voyage: Voyage,
    loadLocation: Location,
    unloadLocation: Location,
    loadTime: Date,
    unloadTime: Date,
  ) {
    Validate.noNilElements([voyage, loadLocation, unloadLocation, loadTime, unloadTime]);

    this.#voyage = voyage;
    this.#loadLocation = loadLocation;
    this.#unloadLocation = unloadLocation;
    this.#loadTime = loadTime;
    this.#unloadTime = unloadTime;
  }

  get voyage() {
    return this.#voyage;
  }

  get loadLocation() {
    return this.#loadLocation;
  }

  get unloadLocation() {
    return this.#unloadLocation;
  }

  get loadTime() {
    return new Date(this.#loadTime);
  }

  get unloadTime() {
    return new Date(this.#unloadTime);
  }

  public sameValueAs(other: Leg): boolean {
    if (!other) return false;

    const conditions = [
      this.voyage.equals(other.voyage),
      this.loadLocation.equals(other.loadLocation),
      this.unloadLocation.equals(other.unloadLocation),
      this.loadTime.getTime() === other.loadTime.getTime(),
      this.unloadTime.getTime() === other.unloadTime.getTime(),
    ];

    return !conditions.some((condition) => !condition);
  }

  public equals(other: object): boolean {
    if (this === other) return true;
    if (!other || !(other instanceof Leg)) return false;

    return this.sameValueAs(other);
  }
}
