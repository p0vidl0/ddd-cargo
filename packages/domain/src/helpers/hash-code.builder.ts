import { isNil } from './validate.helper';

export class HashCodeBuilder {
  #total = 17;

  #multiplier = 37;

  toHashCode(): number {
    return this.#total;
  }

  append(value: any): HashCodeBuilder {
    if (isNil(value)) {
      return this.appendNil();
    }
    if (typeof value === 'boolean') {
      return this.appendBoolean(value);
    }
    if (typeof value === 'number') {
      return this.appendNumber(value);
    }
    if (typeof value === 'string') {
      return this.appendString(value);
    }
    if (typeof value.toString === 'function') {
      return this.appendString(value.toString());
    }
    if (typeof value.hashCode === 'function') {
      return this.appendNumber(value.hashCode());
    }
    if (value instanceof Date) {
      return this.appendNumber(value.getTime());
    }
    throw new Error('The argument has unsupported value');
  }

  private appendBoolean(value: boolean): HashCodeBuilder {
    this.#total = this.#total * this.#multiplier + (value ? 0 : 1);
    return this;
  }

  private appendNumber(value: number): HashCodeBuilder {
    this.#total = this.#total * this.#multiplier + value;
    return this;
  }

  private appendNil(): HashCodeBuilder {
    this.#total *= this.#multiplier;
    return this;
  }

  private appendString(value: string): HashCodeBuilder {
    this.#total = this.#total * this.#multiplier + HashCodeBuilder.hashCodeForString(value);
    return this;
  }

  static hashCodeForString(value: string): number {
    let hash = 0;
    const multiplier = 31;
    const valueLength = value.length;

    if (valueLength === 0) return hash;

    for (let i = 0; i < valueLength; i += 1) {
      hash = hash * multiplier + value.charCodeAt(i);
    }

    return hash;
  }
}
