/**
 * This interface provides a way to let other parts
 * of the system know about events that have occurred.
 *
 * It may be implemented synchronously or asynchronously, using
 * for example JMS.
 */
import { Cargo, HandlingEvent } from '@ddd-cargo/domain';
import { HandlingEventRegistrationAttempt } from '../services/handling-event-registration-attempt';

export interface IApplicationEvents {
  /**
   * A cargo has been handled.
   *
   * @param {HandlingEvent} event handling event
   */
  cargoWasHandled(event: HandlingEvent): void;

  /**
   * A cargo has been misdirected.
   *
   * @param {Cargo} cargo cargo
   */
  cargoWasMisdirected(cargo: Cargo): void;

  /**
   * A cargo has arrived at its final destination.
   *
   * @param {Cargo} cargo cargo
   */
  cargoHasArrived(cargo: Cargo): void;

  /**
   * A handling event regitration attempt is received.
   *
   * @param {HandlingEventRegistrationAttempt} attempt handling event registration attempt
   */
  receivedHandlingEventRegistrationAttempt(attempt: HandlingEventRegistrationAttempt): void;
}
