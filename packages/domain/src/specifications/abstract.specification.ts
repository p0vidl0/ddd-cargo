import { ISpecification } from '../types/specification.interface';
import { IBaseSpecification } from '../types/base-specification.interface';
import { OrSpecification } from './or.specification';
import { AndSpecification } from './and.specification';
import { NotSpecification } from './not.specification';

/**
 * Abstract base implementation of composite {@link ISpecification} with default
 * implementations for `and`, `or` and `not`.
 */
export abstract class AbstractSpecification<T> implements ISpecification<T> {
  /**
   * {@inheritDoc}
   */
  abstract isSatisfiedBy(t: T): boolean;

  /**
   * {@inheritDoc}
   */
  and(specification: ISpecification<T>): IBaseSpecification<T> {
    return new AndSpecification<T>(this, specification);
  }

  /**
   * {@inheritDoc}
   */
  or(specification: ISpecification<T>): IBaseSpecification<T> {
    return new OrSpecification<T>(this, specification);
  }

  /**
   * {@inheritDoc}
   */
  not(specification: ISpecification<T>): IBaseSpecification<T> {
    return new NotSpecification<T>(specification);
  }
}
