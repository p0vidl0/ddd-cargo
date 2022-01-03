/**
 * A location is our model is stops on a journey, such as cargo
 * origin or destination, or carrier movement endpoints.
 *
 * It is uniquely identified by a UN Locode.
 *
 */
import { IEntity } from '../../types/entity.interface';
import { Validate } from '../../helpers/validate.helper';
import { UnLocode } from './un-locode.model';

export class Location implements IEntity<Location> {
  readonly #unLocode: UnLocode;

  readonly #name: string;

  readonly #id: number;

  /**
   * Special Location object that marks an unknown location.
   */
  static UNKNOWN = new Location(new UnLocode('XXXXX'), 'Unknown location', 0);

  /**
   * Package-level constructor, visible for test only.
   *
   * @param unLocode UN Locode
   * @param name     location name
   * @param id
   * @throws IllegalArgumentException if the UN Locode or name is null
   */
  constructor(unLocode: UnLocode, name: string, id?: number) {
    Validate.notNil(unLocode);
    Validate.notNil(name);
    // Validate.notNil(id);

    this.#unLocode = unLocode;
    this.#name = name;
    this.#id = id;
  }

  /**
   * @return UN Locode for this location.
   */
  get unLocode(): UnLocode {
    return this.#unLocode;
  }

  /**
   * @return Actual name of this location, e.g. "Stockholm".
   */
  get name(): string {
    return this.#name;
  }

  get id(): number {
    return this.#id;
  }

  /**
   * @param other to compare
   * @return Since this is an entiy this will be true iff UN locodes are equal.
   */
  equals(other: object): boolean {
    if (other == null) {
      return false;
    }
    if (this === other) {
      return true;
    }
    if (!(other instanceof Location)) {
      return false;
    }
    return this.sameIdentityAs(other as Location);
  }

  sameIdentityAs(other: Location): boolean {
    return this.unLocode.sameValueAs(other.unLocode);
  }

  toString(): string {
    return `${this.name} [${this.unLocode}]`;
  }

  public hashCode() {
    return this.unLocode.hashCode();
  }
}
