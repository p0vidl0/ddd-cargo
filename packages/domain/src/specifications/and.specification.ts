import { IBaseSpecification } from '../types/base-specification.interface';

/**
 * AND specification, used to create a new specifcation that is the AND of two other specifications.
 */
export class AndSpecification<T> implements IBaseSpecification<T> {
  /**
   * Create a new AND specification based on two other spec.
   *
   * @param spec1 ISpecification one.
   * @param spec2 ISpecification two.
   */
  constructor(
    private readonly spec1: IBaseSpecification<T>,
    private readonly spec2: IBaseSpecification<T>,
  ) {}

  /**
   * {@inheritDoc}
   */
  public isSatisfiedBy(t: T): boolean {
    return this.spec1.isSatisfiedBy(t) && this.spec2.isSatisfiedBy(t);
  }
}
