/**
 * Thrown when trying to register an event with an unknown tracking id
 */
import { TrackingId } from '../cargo';
import { CannotCreateHandlingEventException } from './cannot-create-handling-event.exception';

export class UnknownCargoException extends CannotCreateHandlingEventException {
  #trackingId: TrackingId;

  /**
   * @param trackingId cargo tracking id
   */
  constructor(trackingId: TrackingId) {
    super();
    this.#trackingId = trackingId;
  }

  public getMessage(): string {
    return `No cargo with tracking id ${this.#trackingId.idString()} exists in the system`;
  }
}
