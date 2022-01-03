import { stubInterface } from 'ts-sinon';
import {
  Cargo,
  HandlingEvent,
  HandlingEventFactory,
  HandlingEventType,
  ICargoRepository,
  IHandlingEventRepository,
  ILocationRepository,
  IVoyageRepository,
  LocationSamples,
  RouteSpecification,
  TrackingId,
  VoyageSamples,
} from '@ddd-cargo/domain';
import { IApplicationEvents } from '../types/application-events.interface';
import { HandlingEventService } from './handling-event.service';

const { HAMBURG, TOKYO, STOCKHOLM } = LocationSamples;
const { v100 } = VoyageSamples;
const { LOAD } = HandlingEventType;

describe('HandlingEventService', () => {
  const cargoRepository = stubInterface<ICargoRepository>();
  const voyageRepository = stubInterface<IVoyageRepository>();
  const locationRepository = stubInterface<ILocationRepository>();
  const handlingEventRepository = stubInterface<IHandlingEventRepository>();
  const applicationEvents = stubInterface<IApplicationEvents>();

  const cargo = new Cargo(
    new TrackingId('ABC'),
    new RouteSpecification(HAMBURG, TOKYO, new Date()),
  );

  const handlingEventFactory = new HandlingEventFactory(
    cargoRepository,
    voyageRepository,
    locationRepository,
  );
  const service = new HandlingEventService(
    handlingEventRepository,
    applicationEvents,
    handlingEventFactory,
  );

  it('Register Event', () => {
    cargoRepository.find.withArgs(cargo.trackingId).returns(Promise.resolve(cargo));
    voyageRepository.find.withArgs(v100.voyageNumber).returns(v100);
    locationRepository.find.withArgs(STOCKHOLM.unLocode).returns(Promise.resolve(STOCKHOLM));

    service.registerHandlingEvent(
      new Date(),
      cargo.trackingId,
      v100.voyageNumber,
      STOCKHOLM.unLocode,
      LOAD,
    );
  });

  it('Tear Down', () => {
    expect(handlingEventRepository.store.callCount).toBe(1);
    expect(handlingEventRepository.store.firstCall.firstArg instanceof HandlingEvent).toBeTruthy();
    expect(applicationEvents.cargoWasHandled.callCount).toBe(1);
    expect(
      applicationEvents.cargoWasHandled.firstCall.firstArg instanceof HandlingEvent,
    ).toBeTruthy();
  });
});
