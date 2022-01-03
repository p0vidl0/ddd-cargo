import { IEntity } from '../../types/entity.interface';
import { Validate } from '../../helpers/validate.helper';
import { VoyageNumber } from './voyage-number.model';
import { Schedule } from './schedule.model';

export class Voyage implements IEntity<Voyage> {
  readonly #voyageNumber: VoyageNumber;

  readonly #schedule: Schedule;

  // Null object pattern
  public static NONE: Voyage = new Voyage(new VoyageNumber(''), Schedule.EMPTY);

  constructor(voyageNumber: VoyageNumber, schedule: Schedule) {
    Validate.notNil(voyageNumber, 'Voyage number is required');
    Validate.notNil(schedule, 'Schedule is required');

    this.#voyageNumber = voyageNumber;
    this.#schedule = schedule;
  }

  public get voyageNumber(): VoyageNumber {
    return this.#voyageNumber;
  }

  public get schedule(): Schedule {
    return this.#schedule;
  }

  public equals(that: object): boolean {
    if (this === that) return true;
    if (that == null) return false;
    if (!(that instanceof Voyage)) return false;

    return this.sameIdentityAs(that);
  }

  public sameIdentityAs(other: Voyage): boolean {
    return other != null && this.voyageNumber.sameValueAs(other.voyageNumber);
  }

  public toString(): string {
    return `Voyage ${this.voyageNumber}`;
  }

  public hashCode(): number {
    return this.#voyageNumber.hashCode();
  }
}
