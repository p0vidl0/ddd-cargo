import { ICollection } from '../types/collection.interface';
import { instanceOfIComparable } from '../types/comparable.interface';

export class ArrayList<T> implements ICollection<T> {
  readonly #items: T[] = [];

  constructor(items: T[] = []) {
    this.#items = items;
  }

  isEmpty(): boolean {
    return this.#items.length === 0;
  }

  size(): number {
    return this.#items.length;
  }

  add(item: T): boolean {
    this.#items.push(item);
    return true;
  }

  addAll(items: T[] | ArrayList<T>): boolean {
    const elements = Array.isArray(items) ? items : items.toArray();
    elements.forEach((item) => this.#items.push(item));
    return true;
  }

  remove(index: number): boolean {
    if (index < 0 || index < this.#items.length - 1) return false;
    delete this.#items[index];
    return true;
  }

  contains(other: T): boolean {
    return this.#items.some((item: T) => {
      if (instanceOfIComparable<T>(item)) return item.equals(other);
      return item === other;
    });
  }

  toArray(): T[] {
    return this.#items;
  }

  sort(compareFn?: (a: T, b: T) => number): ArrayList<T> {
    return new ArrayList<T>(this.#items.sort(compareFn));
  }

  get(index: number): T {
    if (index < 0 || index > this.size() - 1) return null;
    return this.#items[index];
  }

  getLast(): T {
    if (this.size() === 0) return null;
    return this.#items[this.size() - 1];
  }

  equals(other: ArrayList<T>): boolean {
    if (this.size() !== other.size()) return false;
    return !this.#items.some((item: T, index: number) => {
      const otherItem = other.get(index);
      if (instanceOfIComparable<T>(item)) return item.equals(otherItem);
      return item === otherItem;
    });
  }
}
