import { Cargo, RouteSpecification, TrackingId } from '../cargo';
import { LocationSamples } from '../location';
import { VoyageBuilder } from '../voyage/voyage.builder';
import { VoyageNumber } from '../voyage';
import { ArrayList } from '../../helpers/array-list';
import { HandlingEvent } from './handling-event';
import { HandlingEventType } from './handling-event.type';
import { HandlingHistory } from './handling-history';

describe('models > handling > HandlingHistory', () => {
  const trackingId = new TrackingId('ABC');
  const routeSpecification = new RouteSpecification(
    LocationSamples.SHANGHAI,
    LocationSamples.DALLAS,
    new Date('2009-04-01'),
  );
  const cargo = new Cargo(trackingId, routeSpecification);
  const voyage = new VoyageBuilder(new VoyageNumber('X25'), LocationSamples.HONGKONG)
    .addMovement(LocationSamples.SHANGHAI, new Date(), new Date())
    .addMovement(LocationSamples.DALLAS, new Date(), new Date())
    .build();
  const event1 = new HandlingEvent(
    cargo,
    new Date('2009-03-05'),
    new Date(100),
    HandlingEventType.LOAD,
    LocationSamples.SHANGHAI,
    voyage,
  );
  const event1duplicate = new HandlingEvent(
    cargo,
    new Date('2009-03-05'),
    new Date(200),
    HandlingEventType.LOAD,
    LocationSamples.SHANGHAI,
    voyage,
  );
  const event2 = new HandlingEvent(
    cargo,
    new Date('2009-03-10'),
    new Date(150),
    HandlingEventType.UNLOAD,
    LocationSamples.DALLAS,
    voyage,
  );

  const handlingHistory = new HandlingHistory(new ArrayList([event2, event1, event1duplicate]));

  it('Distinct Events By Completion Time', () => {
    const distinct = handlingHistory.distinctEventsByCompletionTime();
    expect(distinct.size()).toBe(2);
    expect(distinct.get(0).equals(event1)).toBeTruthy();
    expect(distinct.get(1).equals(event2)).toBeTruthy();
  });

  it('Most Recently Completed Event', () => {
    const event = handlingHistory.mostRecentlyCompletedEvent();
    expect(event.equals(event2)).toBeTruthy();
  });
});
