/**
 * Thrown when trying to register an event with an unknown carrier movement id
 */
import { VoyageNumber } from '../voyage';
import { CannotCreateHandlingEventException } from './cannot-create-handling-event.exception';

export class UnknownVoyageException extends CannotCreateHandlingEventException {
  #voyageNumber: VoyageNumber;

  constructor(voyageNumber: VoyageNumber) {
    super();
    this.#voyageNumber = voyageNumber;
  }

  getMessage(): string {
    return `"No voyage with number ${this.#voyageNumber.idString()} exists in the system`;
  }
}
