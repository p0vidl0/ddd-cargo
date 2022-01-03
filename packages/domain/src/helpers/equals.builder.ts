import { instanceOfIComparable } from '../types/comparable.interface';

export class EqualsBuilder {
  #isEquals = true;

  protected setEquals(value: boolean): void {
    this.#isEquals = value;
  }

  public isEquals(): boolean {
    return this.#isEquals;
  }

  append(lhs: any, rhs: any) {
    if (this.#isEquals === false) return this;
    if (lhs === null || rhs === null) {
      this.setEquals(false);
    } else if (instanceOfIComparable(lhs)) {
      this.setEquals(lhs.equals(rhs));
    } else if (lhs instanceof Date && rhs instanceof Date) {
      this.setEquals(lhs.getTime() === rhs.getTime());
    } else {
      this.setEquals(lhs === rhs);
    }

    return this;
  }
}
