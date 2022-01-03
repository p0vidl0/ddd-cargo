import { TrackingId } from '@ddd-cargo/domain';

export interface ICargoInspectionService {
  /**
   * Inspect cargo and send relevant notifications to interested parties,
   * for example if a cargo has been misdirected, or unloaded
   * at the final destination.
   *
   * @param {TrackingId} trackingId cargo tracking id
   */
  inspectCargo(trackingId: TrackingId): void;
}
