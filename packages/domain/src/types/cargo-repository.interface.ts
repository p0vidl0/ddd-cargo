import { Cargo, TrackingId } from '../models';

export interface ICargoRepository {
  /**
   * Finds a cargo using given id.
   *
   * @param trackingId Id
   * @return Cargo if found, else {@code null}
   */
  find(trackingId: TrackingId): Promise<Cargo | null>;

  /**
   * Finds all cargo.
   *
   * @return All cargo.
   */
  findAll(): Promise<Cargo[]>;

  /**
   * Saves given cargo.
   *
   * @param cargo cargo to save
   */
  store(cargo: Cargo): void;

  /**
   * @return A unique, generated tracking Id.
   */
  nextTrackingId(): TrackingId;
}
