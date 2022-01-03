export interface IComparable<T> {
  equals(item: T): boolean;
}

export const instanceOfIComparable = <T>(object: any): object is IComparable<T> =>
  'equals' in object;
