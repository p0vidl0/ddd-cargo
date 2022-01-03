import { ICargoRepository, IVoyageRepository, ILocationRepository } from '../../types';
import { Cargo, TrackingId } from '../cargo';
import { UnLocode } from '../location';
import { Location } from '../location';
import { VoyageNumber } from '../voyage';
import { Voyage } from '../voyage/voyage.model';
import { HandlingEvent } from './handling-event';
import { HandlingEventType } from './handling-event.type';
import { CannotCreateHandlingEventException } from './cannot-create-handling-event.exception';
import { UnknownCargoException } from './unknown-cargo.exception';
import { UnknownVoyageException } from './unknown-voyage.exception';
import { UnknownLocationException } from './unknown-location.exception';

export class HandlingEventFactory {
  #cargoRepository: ICargoRepository;
  #voyageRepository: IVoyageRepository;
  #locationRepository: ILocationRepository;

  constructor(
    cargoRepository: ICargoRepository,
    voyageRepository: IVoyageRepository,
    locationRepository: ILocationRepository,
  ) {
    this.#cargoRepository = cargoRepository;
    this.#voyageRepository = voyageRepository;
    this.#locationRepository = locationRepository;
  }

  /**
   * @param registrationTime  time when this event was received by the system
   * @param completionTime    when the event was completed, for example finished loading
   * @param trackingId        cargo tracking id
   * @param voyageNumber      voyage number
   * @param unLocode          United Nations Location Code for the location of the event
   * @param type              type of event
   * @throws UnknownVoyageException   if there's no voyage with this number
   * @throws UnknownCargoException    if there's no cargo with this tracking id
   * @throws UnknownLocationException if there's no location with this UN Locode
   * @return A handling event.
   */
  async createHandlingEvent(
    registrationTime: Date,
    completionTime: Date,
    trackingId: TrackingId,
    voyageNumber: VoyageNumber,
    unLocode: UnLocode,
    type: HandlingEventType,
  ): Promise<HandlingEvent> {
    const cargo: Cargo = await this.findCargo(trackingId);
    const voyage: Voyage = await this.findVoyage(voyageNumber);
    const location: Location = await this.findLocation(unLocode);

    try {
      if (!voyage) {
        return new HandlingEvent(cargo, completionTime, registrationTime, type, location);
      }
      return new HandlingEvent(cargo, completionTime, registrationTime, type, location, voyage);
    } catch (err) {
      throw new CannotCreateHandlingEventException(err.message);
    }
  }

  private async findCargo(trackingId: TrackingId): Promise<Cargo> {
    const cargo: Cargo = await this.#cargoRepository.find(trackingId);
    if (!cargo) throw new UnknownCargoException(trackingId);
    return cargo;
  }

  private findVoyage(voyageNumber: VoyageNumber): Voyage {
    if (!voyageNumber) {
      return null;
    }

    const voyage: Voyage = this.#voyageRepository.find(voyageNumber);
    if (!voyage) {
      throw new UnknownVoyageException(voyageNumber);
    }

    return voyage;
  }

  private async findLocation(unlocode: UnLocode): Promise<Location> {
    const location: Location = await this.#locationRepository.find(unlocode);
    if (!location) {
      throw new UnknownLocationException(unlocode);
    }

    return location;
  }
}
