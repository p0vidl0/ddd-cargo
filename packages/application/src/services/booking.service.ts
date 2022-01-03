import {
  Cargo,
  TrackingId,
  UnLocode,
  RouteSpecification,
  Itinerary,
  IllegalArgumentException,
  ICargoRepository,
  ILocationRepository,
  IRoutingService,
} from '@ddd-cargo/domain';
import { IBookingService } from '../types/booking-service.interface';

export class BookingService implements IBookingService {
  private readonly cargoRepository: ICargoRepository;

  private readonly locationRepository: ILocationRepository;

  private readonly routingService: IRoutingService;
  // private readonly logger; // TODO add logger

  constructor(
    cargoRepository: ICargoRepository,
    locationRepository: ILocationRepository,
    routingService: IRoutingService,
  ) {
    this.cargoRepository = cargoRepository;
    this.locationRepository = locationRepository;
    this.routingService = routingService;
  }

  async bookNewCargo(
    originUnLocode: UnLocode,
    destinationUnLocode: UnLocode,
    arrivalDeadline: Date,
  ): Promise<TrackingId> {
    const trackingId = this.cargoRepository.nextTrackingId();
    const origin = await this.locationRepository.find(originUnLocode);
    const destination = await this.locationRepository.find(destinationUnLocode);
    const routeSpecification = new RouteSpecification(origin, destination, arrivalDeadline);

    const cargo = new Cargo(trackingId, routeSpecification);
    this.cargoRepository.store(cargo);
    // this.logger.info(`Booked new cargo with tracking id ${cargo.trackingId.idString()}`);

    return cargo.trackingId;
  }

  async requestPossibleRoutesForCargo(trackingId: TrackingId): Promise<Itinerary[]> {
    const cargo = await this.cargoRepository.find(trackingId);
    if (!cargo) return [];

    return this.routingService.fetchRoutesForSpecification(cargo.routeSpecification);
  }

  async assignCargoToRoute(itinerary: Itinerary, trackingId: TrackingId): Promise<void> {
    const cargo = await this.cargoRepository.find(trackingId);
    if (!cargo)
      throw new IllegalArgumentException(
        `Can't assign itinerary to non-existing cargo ${trackingId}`,
      );

    cargo.assignToRoute(itinerary);
    this.cargoRepository.store(cargo);

    // this.logger.info(`Assigned cargo ${trackingId} to new route`);
  }

  async changeDestination(trackingId: TrackingId, unLocode: UnLocode): Promise<void> {
    const cargo = await this.cargoRepository.find(trackingId);
    if (!cargo)
      throw new IllegalArgumentException(
        `Can't change destination for non-existing cargo ${trackingId}`,
      );
    const newDestination = await this.locationRepository.find(unLocode);
    const routeSpecification = new RouteSpecification(
      cargo.origin,
      newDestination,
      cargo.routeSpecification.arrivalDeadline,
    );

    cargo.specifyNewRoute(routeSpecification);
    this.cargoRepository.store(cargo);
    // this.logger.info(`Changed destination for cargo ${trackingId} to ${routeSpecification.destination}`);
  }
}
