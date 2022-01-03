import { IBaseSpecification } from './base-specification.interface';

/**
 * Specification interface.
 * <p/>
 * Use {AbstractSpecification} as base for creating specifications, and
 * only the method {@link #isSatisfiedBy(Object)} must be implemented.
 */
export interface ISpecification<T> extends IBaseSpecification<T> {
  /**
   * Check if {@code t} is satisfied by the specification.
   *
   * @param t Object to test.
   * @return {@code true} if {@code t} satisfies the specification.
   */
  isSatisfiedBy(t: T): boolean;

  /**
   * Create a new specification that is the AND operation of {@code this} specification and another specification.
   * @param specification ISpecification to AND.
   * @return A new specification.
   */
  and(specification: ISpecification<T>): IBaseSpecification<T>;

  /**
   * Create a new specification that is the OR operation of {@code this} specification and another specification.
   * @param specification ISpecification to OR.
   * @return A new specification.
   */
  or(specification: ISpecification<T>): IBaseSpecification<T>;

  /**
   * Create a new specification that is the NOT operation of {@code this} specification.
   * @param specification ISpecification to NOT.
   * @return A new specification.
   */
  not(specification: ISpecification<T>): IBaseSpecification<T>;
}
