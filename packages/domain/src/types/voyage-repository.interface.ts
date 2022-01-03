import { Voyage } from '../models/voyage/voyage.model';
import { VoyageNumber } from '../models';

export interface IVoyageRepository {
  /**
   * Finds a voyage using voyage number.
   *
   * @param voyageNumber voyage number
   * @return The voyage, or null if not found.
   */
  find(voyageNumber: VoyageNumber): Voyage;
}
