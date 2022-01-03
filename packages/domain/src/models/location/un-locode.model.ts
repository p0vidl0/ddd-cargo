/**
 * United nations location code.
 * <p/>
 * http://www.unece.org/cefact/locode/
 * http://www.unece.org/cefact/locode/DocColumnDescription.htm#LOCODE
 */
import { IValueObject } from '../../types/value-object.interface';
import { Validate } from '../../helpers/validate.helper';
import { HashCodeBuilder } from '../../helpers/hash-code.builder';

export class UnLocode implements IValueObject<UnLocode> {
  private readonly unLocode: string;

  // Country code is exactly two letters.
  // Location code is usually three letters, but may contain the numbers 2-9 as well
  private static validPattern = /^[a-z]{2}[a-z2-9]{3}$/i;

  constructor(countryAndLocation: string) {
    Validate.notNil(countryAndLocation, 'Country and location may not be null');
    Validate.isTrue(
      UnLocode.validPattern.test(countryAndLocation),
      `${countryAndLocation} is not a valid UN/LOCODE (does not match pattern)`,
    );

    this.unLocode = countryAndLocation.toUpperCase();
  }

  /**
   * @return country code and location code concatenated, always upper case.
   */
  public idString(): string {
    return this.unLocode;
  }

  public equals(other: object): boolean {
    if (this === other) return true;
    if (other == null || !(other instanceof UnLocode)) return false;

    return this.sameValueAs(other as UnLocode);
  }

  public sameValueAs(other: UnLocode): boolean {
    return other != null && this.unLocode === other.unLocode;
  }

  public toString() {
    return this.idString();
  }

  public hashCode() {
    return HashCodeBuilder.hashCodeForString(this.toString());
  }
}
