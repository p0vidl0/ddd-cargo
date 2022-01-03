import { IBaseSpecification } from '../types/base-specification.interface';

/**
 * OR specification, used to create a new specification that is the AND of two other specifications.
 */
export class OrSpecification<T> implements IBaseSpecification<T> {
  /**
   * Create a new OR specification based on two other spec.
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
    return this.spec1.isSatisfiedBy(t) || this.spec2.isSatisfiedBy(t);
  }
}
