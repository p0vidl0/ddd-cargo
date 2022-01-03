/**
 * Specification interface.
 * <p/>
 * Use {AbstractSpecification} as base for creating specifications, and
 * only the method {@link #isSatisfiedBy(Object)} must be implemented.
 */
export interface IBaseSpecification<T> {
  /**
   * Check if {@code t} is satisfied by the specification.
   *
   * @param t Object to test.
   * @return {@code true} if {@code t} satisfies the specification.
   */
  isSatisfiedBy(t: T): boolean;
}
