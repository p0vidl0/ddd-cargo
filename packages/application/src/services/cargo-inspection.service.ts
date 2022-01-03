import { ICargoRepository, IHandlingEventRepository, TrackingId } from '@ddd-cargo/domain';
import { Validate } from '@ddd-cargo/domain/dist/helpers/validate.helper';
import { ICargoInspectionService } from '../types/cargo-inspection.service.interface';
import { IApplicationEvents } from '../types/application-events.interface';

export class CargoInspectionService implements ICargoInspectionService {
  private readonly applicationEvents: IApplicationEvents;

  private readonly cargoRepository: ICargoRepository;

  private readonly handlingEventRepository: IHandlingEventRepository;

  private readonly logger;

  constructor(
    applicationEvents: IApplicationEvents,
    cargoRepository: ICargoRepository,
    handlingEventRepository: IHandlingEventRepository,
  ) {
    this.applicationEvents = applicationEvents;
    this.cargoRepository = cargoRepository;
    this.handlingEventRepository = handlingEventRepository;
  }

  async inspectCargo(trackingId: TrackingId): Promise<void> {
    Validate.notNil(trackingId, 'Tracking ID is required');

    const cargo = await this.cargoRepository.find(trackingId);
    if (!cargo) {
      this.logger.warn(`Can't inspect non-existing cargo ${trackingId}`);
      return;
    }

    const handlingHistory = this.handlingEventRepository.lookupHandlingHistoryOfCargo(trackingId);
    cargo.deriveDeliveryProgress(handlingHistory);

    if (cargo.delivery.isMisdirected) this.applicationEvents.cargoWasMisdirected(cargo);

    if (cargo.delivery.isUnloadedAtDestination) this.applicationEvents.cargoHasArrived(cargo);

    this.cargoRepository.store(cargo);
  }
}
