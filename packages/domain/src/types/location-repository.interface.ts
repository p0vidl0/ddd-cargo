import { Location, UnLocode } from '../models';

export interface ILocationRepository {
  /**
   * Finds a location using given unlocode.
   *
   * @param unLocode UNLocode.
   * @return Location.
   */
  find(unLocode: UnLocode): Promise<Location>;

  /**
   * Finds all locations.
   *
   * @return All locations.
   */
  findAll(): Promise<Location[]>;

  store(location: Location): Promise<Location>;
}
