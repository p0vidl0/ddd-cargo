/**
 * The handling history of a cargo.
 */
import { IValueObject } from '../../types/value-object.interface';
import { ArrayList } from '../../helpers/array-list';
import { HandlingEvent } from './handling-event';

export class HandlingHistory implements IValueObject<HandlingHistory> {
  #handlingEvents: ArrayList<HandlingEvent>;

  static EMPTY = new HandlingHistory(new ArrayList<HandlingEvent>());

  constructor(handlingEvents: ArrayList<HandlingEvent>) {
    // TODO validate with exception
    // Validate.notNull(handlingEvents, "Handling events are required");

    this.#handlingEvents = handlingEvents;
  }

  /**
   * @return A distinct list (no duplicate registrations) of handling events, ordered by completion time.
   */
  distinctEventsByCompletionTime(): ArrayList<HandlingEvent> {
    type EventMap = Map<number, HandlingEvent>;
    const reducer = (acc: EventMap, item: HandlingEvent) => acc.set(item.hashCode(), item);
    const distinct = this.#handlingEvents
      .toArray()
      .reduce(reducer, new Map<number, HandlingEvent>())
      .values();
    const sorter = (he1: HandlingEvent, he2: HandlingEvent) =>
      he1.completionTime > he2.completionTime ? 1 : -1;
    // TODO: unmodifiable
    return new ArrayList(Array.from(distinct)).sort(sorter);
  }

  /**
   * @return Most recently completed event, or null if the delivery history is empty.
   */
  mostRecentlyCompletedEvent(): HandlingEvent {
    const distinctEvents = this.distinctEventsByCompletionTime();
    if (distinctEvents.size() === 0) return null;
    return distinctEvents.getLast();
  }

  sameValueAs(other: HandlingHistory): boolean {
    return other != null && this.#handlingEvents.equals(other.#handlingEvents);
  }

  equals(other: object): boolean {
    if (this === other) return true;
    if (!other || !(other instanceof HandlingHistory)) return false;

    return this.sameValueAs(other);
  }
}
