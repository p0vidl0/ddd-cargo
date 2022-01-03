/**
 * An entity, as explained in the DDD book
 */
export interface IEntity<T> {
  /**
   * Entities compare by identity, not by attributes.
   *
   * @param other The other entity.
   * @return true if the identities are the same, regardless of other attributes.
   */
  sameIdentityAs(other: T): boolean;
}
