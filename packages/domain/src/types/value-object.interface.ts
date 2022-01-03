/**
 * A value object, as described in the DDD book
 */
export interface IValueObject<T> {
  /**
   * Value objects compare by the values of their attributes, they don't have an identity.
   *
   * @param other The other value object.
   * @return true if the given value object's and this value object's attributes are the same.
   */
  sameValueAs(other: T): boolean;
}
