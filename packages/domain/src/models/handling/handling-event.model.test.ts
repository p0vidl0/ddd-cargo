import { LocationSamples } from '../location';
import { Cargo, TrackingId, RouteSpecification } from '../cargo';
import { VoyageSamples } from '../voyage';
import { HandlingEvent } from './handling-event';
import { HandlingEventType } from './handling-event.type';

describe('model > handling > HandlingEvent', () => {
  const trackingId = new TrackingId('XYZ');
  const routeSpecification = new RouteSpecification(
    LocationSamples.HONGKONG,
    LocationSamples.NEWYORK,
    new Date(),
  );
  const cargo = new Cargo(trackingId, routeSpecification);

  it('New With Carrier Movement', () => {
    const event1 = new HandlingEvent(
      cargo,
      new Date(),
      new Date(),
      HandlingEventType.LOAD,
      LocationSamples.HONGKONG,
      VoyageSamples.v100,
    );
    expect(event1.location.equals(LocationSamples.HONGKONG));

    const event2 = new HandlingEvent(
      cargo,
      new Date(),
      new Date(),
      HandlingEventType.UNLOAD,
      LocationSamples.NEWYORK,
      VoyageSamples.v100,
    );
    expect(event2.location.equals(LocationSamples.HONGKONG));

    const { CLAIM, RECEIVE, CUSTOMS, LOAD, UNLOAD } = HandlingEventType;

    const func = (type) => () =>
      new HandlingEvent(
        cargo,
        new Date(),
        new Date(),
        type,
        LocationSamples.HONGKONG,
        VoyageSamples.v100,
      );

    // These event types prohibit a carrier movement association
    [CLAIM, RECEIVE, CUSTOMS].forEach((type) => expect(func(type)).toThrow());

    const func2 = (type) => () =>
      new HandlingEvent(cargo, new Date(), new Date(), type, LocationSamples.HONGKONG, null);

    // These event types requires a carrier movement association
    [LOAD, UNLOAD].forEach((type) => expect(func2(type)).toThrow());
  });

  it('New With Location', () => {
    const date = new Date();
    const event = new HandlingEvent(
      cargo,
      date,
      date,
      HandlingEventType.CLAIM,
      LocationSamples.HELSINKI,
    );
    expect(event.location.equals(LocationSamples.HELSINKI));
  });

  it('Current Location Load Event', () => {
    const date = new Date();
    const event = new HandlingEvent(
      cargo,
      date,
      date,
      HandlingEventType.LOAD,
      LocationSamples.CHICAGO,
      VoyageSamples.v200,
    );
    expect(event.location.equals(LocationSamples.CHICAGO));
  });

  it('Current Location Load Event', () => {
    const date = new Date();
    const event = new HandlingEvent(
      cargo,
      date,
      date,
      HandlingEventType.LOAD,
      LocationSamples.CHICAGO,
      VoyageSamples.v200,
    );
    expect(event.location.equals(LocationSamples.CHICAGO));
  });

  it('Current Location Unload Event', () => {
    const date = new Date();
    const event = new HandlingEvent(
      cargo,
      date,
      date,
      HandlingEventType.LOAD,
      LocationSamples.HAMBURG,
      VoyageSamples.v200,
    );
    expect(event.location.equals(LocationSamples.HAMBURG));
  });

  it('Current Location Received Event', () => {
    const date = new Date();
    const event = new HandlingEvent(
      cargo,
      date,
      date,
      HandlingEventType.RECEIVE,
      LocationSamples.CHICAGO,
    );
    expect(event.location.equals(LocationSamples.CHICAGO));
  });

  it('Current Location Claimed Event', () => {
    const date = new Date();
    const event = new HandlingEvent(
      cargo,
      date,
      date,
      HandlingEventType.RECEIVE,
      LocationSamples.CHICAGO,
    );
    expect(event.location.equals(LocationSamples.CHICAGO));
  });

  it('Equals And Same As', () => {
    const timeOccured = new Date();
    const timeRegistered = new Date();

    const event1 = new HandlingEvent(
      cargo,
      timeOccured,
      timeRegistered,
      HandlingEventType.LOAD,
      LocationSamples.CHICAGO,
      VoyageSamples.v200,
    );
    const event2 = new HandlingEvent(
      cargo,
      timeOccured,
      timeRegistered,
      HandlingEventType.LOAD,
      LocationSamples.CHICAGO,
      VoyageSamples.v200,
    );

    expect(event1.equals(event2)).toBeTruthy();
    expect(event2.equals(event1)).toBeTruthy();

    expect(event1.equals(event1)).toBeTruthy();

    expect(event2.equals(null)).toBeFalsy();
    expect(event2.equals({})).toBeFalsy();
  });
});
