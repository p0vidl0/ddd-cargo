import { Enum, EnumType } from 'ts-jenum';

@Enum('type')
export class HandlingEventType extends EnumType<HandlingEventType>() {
  static readonly LOAD = new HandlingEventType(1, true, 'LOAD');

  static readonly UNLOAD = new HandlingEventType(2, true, 'UNLOAD');

  static readonly RECEIVE = new HandlingEventType(3, false, 'RECEIVE');

  static readonly CLAIM = new HandlingEventType(4, false, 'CLAIM');

  static readonly CUSTOMS = new HandlingEventType(5, false, 'CUSTOMS');

  readonly #name: string;

  readonly type: number;

  readonly #voyageRequired: boolean;

  private constructor(type: number, voyageRequired: boolean, name: string) {
    super();
    this.type = type;
    this.#name = name;
    this.#voyageRequired = voyageRequired;
  }

  get name() {
    return this.#name;
  }

  toString() {
    return this.#name;
  }

  /**
   * @return True if a voyage association is required for this event type.
   */
  requiresVoyage(): boolean {
    return this.#voyageRequired;
  }

  /**
   * @return True if a voyage association is prohibited for this event type.
   */
  prohibitsVoyage(): boolean {
    return !this.requiresVoyage();
  }

  sameValueAs(other: HandlingEventType): boolean {
    return other && this.type === other.type && this.#voyageRequired === other.#voyageRequired;
  }

  equals(other: HandlingEventType): boolean {
    return other && this.type === other.type && this.#voyageRequired === other.#voyageRequired;
  }

  // toString() {
  //   return this.#type.toString(10);
  // }
}
