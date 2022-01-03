import { Voyage } from '../voyage/voyage.model';
import { Location } from '../location';
import { HandlingEventType } from '../handling';
import { IValueObject } from '../../types/value-object.interface';
import { EqualsBuilder } from '../../helpers/equals.builder';

/**
 * A handling activity represents how and where a cargo can be handled,
 * and can be used to express predictions about what is expected to
 * happen to a cargo in the future.
 *
 */
export class HandlingActivity implements IValueObject<HandlingActivity> {
  // TODO make HandlingActivity a part of HandlingEvent too? There is some overlap.

  readonly #type: HandlingEventType;

  readonly #location: Location;

  readonly #voyage: Voyage;

  constructor(type: HandlingEventType, location: Location, voyage?: Voyage) {
    // TODO validation with exception
    // Validate.notNull(type, "Handling event type is required");
    // Validate.notNull(location, "Location is required");
    // Validate.notNull(location, "Voyage is required");

    this.#type = type;
    this.#location = location;
    this.#voyage = voyage;
  }

  get type(): HandlingEventType {
    return this.#type;
  }

  get location(): Location {
    return this.#location;
  }

  get voyage(): Voyage {
    return this.#voyage;
  }

  sameValueAs(other: HandlingActivity): boolean {
    if (!other) return false;
    return new EqualsBuilder()
      .append(this.type, other.type)
      .append(this.location, other.location)
      .append(this.voyage, other.voyage)
      .isEquals();
  }

  equals(other: object): boolean {
    if (other === this) return true;
    if (!other || !(other instanceof HandlingActivity)) return false;

    return this.sameValueAs(other);
  }
}
