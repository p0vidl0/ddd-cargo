import { HandlingEventType, TrackingId, UnLocode, VoyageNumber } from '@ddd-cargo/domain';

export interface IHandlingEventService {
  /**
   * Registers a handling event in the system, and notifies interested
   * parties that a cargo has been handled.
   *
   * @param {Date} completionTime when the event was completed
   * @param {TrackingId} trackingId cargo tracking id
   * @param {VoyageNumber} voyageNumber voyage number
   * @param {UnLocode} unLocode UN locode for the location where the event occurred
   * @param {HandlingEventType} type type of event
   * @throws se.citerus.dddsample.domain.model.handling.CannotCreateHandlingEventException
   *  if a handling event that represents an actual event that's relevant to a cargo we're tracking
   *  can't be created from the parameters
   */
  registerHandlingEvent(
    completionTime: Date,
    trackingId: TrackingId,
    voyageNumber: VoyageNumber,
    unLocode: UnLocode,
    type: HandlingEventType,
  ): void;
}
