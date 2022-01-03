import { IBaseSpecification } from '../types/base-specification.interface';

/**
 * NOT specification, used to create a new specifcation that is the AND of two other specifications.
 */

export class NotSpecification<T> implements IBaseSpecification<T> {
  /**
   * Create a new NOT specification based on other spec.
   *
   * @param spec1 ISpecification to not.
   */
  constructor(private readonly spec1: IBaseSpecification<T>) {}

  /**
   * {@inheritDoc}
   */
  public isSatisfiedBy(t: T): boolean {
    return !this.spec1.isSatisfiedBy(t);
  }
}
