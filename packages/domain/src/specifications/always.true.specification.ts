import { AbstractSpecification } from './abstract.specification';

export class AlwaysTrueSpecification<T> extends AbstractSpecification<T> {
  public isSatisfiedBy(_o: T): boolean {
    return true;
  }
}
