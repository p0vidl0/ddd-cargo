/**
 * Identifies a voyage.
 */
import { IValueObject } from '../../types/value-object.interface';
import { Validate } from '../../helpers/validate.helper';
import { HashCodeBuilder } from '../../helpers/hash-code.builder';

export class VoyageNumber implements IValueObject<VoyageNumber> {
  constructor(private readonly number: string) {
    Validate.notNil(this.number);
  }

  equals(other: object): boolean {
    if (this === other) return true;
    if (!other) return false;
    if (!(other instanceof VoyageNumber)) return false;

    return this.sameValueAs(other);
  }

  sameValueAs(other: VoyageNumber): boolean {
    return other && this.number.toString() === other.toString();
  }

  toString(): string {
    return this.number;
  }

  idString(): string {
    return this.number;
  }

  hashCode(): number {
    return HashCodeBuilder.hashCodeForString(this.number);
  }
}
