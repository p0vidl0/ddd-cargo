export interface ICollection<T> {
  size(): number;
  isEmpty(): boolean;
  contains(item: T): boolean;
  add(item: T): boolean;
  remove(index: number): boolean;
  toArray(): T[];
}
