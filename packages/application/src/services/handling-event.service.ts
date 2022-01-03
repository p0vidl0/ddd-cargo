import {
  HandlingEventFactory,
  HandlingEventType,
  IHandlingEventRepository,
  TrackingId,
  UnLocode,
  VoyageNumber,
} from '@ddd-cargo/domain';
import { IApplicationEvents } from '../types/application-events.interface';
import { IHandlingEventService } from '../types/handling-event-service.interface';

export class HandlingEventService implements IHandlingEventService {
  private readonly applicationEvents: IApplicationEvents;

  private readonly handlingEventRepository: IHandlingEventRepository;

  private readonly handlingEventFactory: HandlingEventFactory;
  // private readonly logger; // TODO add logger

  constructor(
    handlingEventRepository: IHandlingEventRepository,
    applicationEvents: IApplicationEvents,
    handlingEventFactory: HandlingEventFactory,
  ) {
    this.handlingEventRepository = handlingEventRepository;
    this.applicationEvents = applicationEvents;
    this.handlingEventFactory = handlingEventFactory;
  }

  // @Transactional(rollbackFor = CannotCreateHandlingEventException.class)
  async registerHandlingEvent(
    completionTime: Date,
    trackingId: TrackingId,
    voyageNumber: VoyageNumber,
    unLocode: UnLocode,
    type: HandlingEventType,
  ): Promise<void> {
    const registrationTime = new Date();

    // Using a factory to create a HandlingEvent (aggregate). This is where
    // it is determined whether the incoming data, the attempt, actually is capable
    // of representing a real handling event.
    const event = await this.handlingEventFactory.createHandlingEvent(
      registrationTime,
      completionTime,
      trackingId,
      voyageNumber,
      unLocode,
      type,
    );

    // Store the new handling event, which updates the persistent
    // state of the handling event aggregate (but not the cargo aggregate -
    // that happens asynchronously!)
    await this.handlingEventRepository.store(event);

    // Publish an event stating that a cargo has been handled.
    this.applicationEvents.cargoWasHandled(event);

    // this.logger.info('Registered handling event');
  }
}
