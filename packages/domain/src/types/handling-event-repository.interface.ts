import { TrackingId, HandlingEvent } from '../models';
import { HandlingHistory } from '../models/handling/handling-history';

/**
 * Handling event repository.
 */
export interface IHandlingEventRepository {
  /**
   * Stores a (new) handling event.
   *
   * @param event handling event to save
   */
  store(event: HandlingEvent): void;

  /**
   * @param trackingId cargo tracking id
   * @return The handling history of this cargo
   */
  lookupHandlingHistoryOfCargo(trackingId: TrackingId): HandlingHistory;
}
