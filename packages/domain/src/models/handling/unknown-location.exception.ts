import { UnLocode } from '../location';
import { CannotCreateHandlingEventException } from './cannot-create-handling-event.exception';

export class UnknownLocationException extends CannotCreateHandlingEventException {
  #unlocode: UnLocode;

  constructor(unlocode: UnLocode) {
    super();
    this.#unlocode = unlocode;
  }

  getMessage(): string {
    return `No location with UN locode ${this.#unlocode.idString()} exists in the system`;
  }
}
