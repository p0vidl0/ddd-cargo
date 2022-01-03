import { stubInterface } from 'ts-sinon';
import {
  Cargo,
  ICargoRepository,
  ILocationRepository,
  IRoutingService,
  LocationSamples,
  TrackingId,
  UnLocode,
} from '@ddd-cargo/domain';
import { BookingService } from './booking.service';

const { CHICAGO, STOCKHOLM } = LocationSamples;

describe('BookingService', () => {
  const cargoRepository = stubInterface<ICargoRepository>();
  const locationRepository = stubInterface<ILocationRepository>();
  const routingService = stubInterface<IRoutingService>();
  const bookingService = new BookingService(cargoRepository, locationRepository, routingService);

  it('Register New', async () => {
    const expectedTrackingId = new TrackingId('TRK1');
    const fromUnlocode = new UnLocode('USCHI');
    const toUnlocode = new UnLocode('SESTO');

    cargoRepository.nextTrackingId.returns(expectedTrackingId);
    locationRepository.find.withArgs(fromUnlocode).returns(Promise.resolve(CHICAGO));
    locationRepository.find.withArgs(toUnlocode).returns(Promise.resolve(STOCKHOLM));

    const trackingId = await bookingService.bookNewCargo(fromUnlocode, toUnlocode, new Date());
    expect(trackingId).toBe(expectedTrackingId);
  });

  it('Tear Down', () => {
    expect(cargoRepository.store.callCount).toBe(1);
    expect(cargoRepository.store.firstCall.firstArg instanceof Cargo).toBeTruthy();
    expect(locationRepository.find.callCount).toBe(2);
    expect(locationRepository.find.firstCall.firstArg instanceof UnLocode).toBeTruthy();
    expect(locationRepository.find.secondCall.firstArg instanceof UnLocode).toBeTruthy();
  });
});
