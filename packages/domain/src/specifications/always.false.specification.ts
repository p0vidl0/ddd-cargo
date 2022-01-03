import { AbstractSpecification } from './abstract.specification';

export class AlwaysFalseSpecification<T> extends AbstractSpecification<T> {
  public isSatisfiedBy(_o: T): boolean {
    return false;
  }
}
