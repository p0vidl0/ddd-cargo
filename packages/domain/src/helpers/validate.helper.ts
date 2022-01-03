import { IllegalArgumentException } from '../exceptions';

export const isNil = (value: any) => value === null || value === undefined;
const isArray = (value: any[]) => Array.isArray(value);

export class Validate {
  static isTrue(expression: boolean, message = 'The validated expression is false'): void {
    if (!expression) {
      throw new IllegalArgumentException(message);
    }
  }

  static isArray(value: any, message = 'Validated value is not array'): void {
    if (!isArray(value)) {
      throw new IllegalArgumentException(message);
    }
  }

  static notNil(value: any, message = 'Validated value is nil'): void {
    if (isNil(value)) {
      throw new IllegalArgumentException(message);
    }
  }

  static notNull(value: any, message = 'Validated value is null'): void {
    if (value === null) {
      throw new IllegalArgumentException(message);
    }
  }

  static notEmpty(value: any[], message = 'Validated value is empty') {
    this.isArray(value, message);
    if (value.length === 0) {
      throw new IllegalArgumentException(message);
    }
  }

  static noNilElements(array: any[], message?: string): void {
    this.isArray(array, message);
    array.forEach((item: any, index: number) => {
      if (isNil(item)) {
        throw new IllegalArgumentException(
          message || `The validated array contains nil element at index: ${index}`,
        );
      }
    });
  }

  // public static void allElementsOfType(Collection collection, Class clazz, String message) {
  //   notNull(collection);
  //   notNull(clazz);
  //   Iterator it = collection.iterator();
  //
  //   do {
  //     if (!it.hasNext()) {
  //       return;
  //     }
  //   } while(clazz.isInstance(it.next()));
  //
  //   throw new IllegalArgumentException(message);
  // }
  //
  // public static void allElementsOfType(Collection collection, Class clazz) {
  //   notNull(collection);
  //   notNull(clazz);
  //   int i = 0;
  //
  //   for(Iterator it = collection.iterator(); it.hasNext(); ++i) {
  //     if (!clazz.isInstance(it.next())) {
  //       throw new IllegalArgumentException(
  //       "The validated collection contains an element not of type " + clazz.getName() + " at index: " + i);
  //     }
  //   }
  // }
}
