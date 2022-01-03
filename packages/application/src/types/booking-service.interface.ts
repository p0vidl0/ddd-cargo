import { UnLocode, TrackingId, Itinerary } from '@ddd-cargo/domain';

/**
 * Cargo booking service interface
 */
export interface IBookingService {
  /**
   * Registers a new cargo in the tracking system, not yet routed.
   *
   * @param {UnLocode} origin      cargo origin
   * @param {UnLocode} destination cargo destination
   * @param {Date} arrivalDeadline arrival deadline
   * @return Cargo tracking id
   */
  bookNewCargo(origin: UnLocode, destination: UnLocode, arrivalDeadline: Date): Promise<TrackingId>;

  /**
   * Requests a list of itineraries describing possible routes for this cargo.
   *
   * @param trackingId cargo tracking id
   * @return A list of possible itineraries for this cargo
   */
  requestPossibleRoutesForCargo(trackingId: TrackingId): Promise<Itinerary[]>;

  /**
   * @param {Itinerary} itinerary itinerary describing the selected route
   * @param {TrackingId} trackingId cargo tracking id
   */
  assignCargoToRoute(itinerary: Itinerary, trackingId: TrackingId): void;

  /**
   * Changes the destination of a cargo.
   *
   * @param {TrackingId} trackingId cargo tracking id
   * @param {UnLocode} unLocode UN locode of new destination
   */
  changeDestination(trackingId: TrackingId, unLocode: UnLocode): void;
}
