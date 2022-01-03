import { IValueObject } from '../../types/value-object.interface';
import { Validate } from '../../helpers/validate.helper';
import { CarrierMovement } from './carrier-movement.model';

/**
 * A voyage schedule
 */
export class Schedule implements IValueObject<Schedule> {
  readonly #carrierMovements: CarrierMovement[] = [];

  public static EMPTY: Schedule = Schedule.buildEmpty();

  constructor(carrierMovements: CarrierMovement[]) {
    this.#carrierMovements = carrierMovements;
  }

  public get carrierMovements(): CarrierMovement[] {
    // TODO immutable copy
    return this.#carrierMovements;
  }

  public sameValueAs(other: Schedule): boolean {
    return (
      other != null &&
      this.carrierMovements.every((cm: CarrierMovement) => cm.equals(other.carrierMovements))
    );
  }

  public equals(that: object): boolean {
    if (this === that) return true;
    if (!that || !(that instanceof Schedule)) return false;

    return this.sameValueAs(that);
  }

  static build(carrierMovements: CarrierMovement[]) {
    Validate.notNil(carrierMovements);
    Validate.noNilElements(carrierMovements);
    Validate.notEmpty(carrierMovements);

    return new Schedule(carrierMovements);
  }

  private static buildEmpty() {
    return new Schedule([]);
  }
}
