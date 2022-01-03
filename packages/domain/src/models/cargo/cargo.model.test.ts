import { Location, LocationSamples } from '../location';
import { HandlingEventType, HandlingEvent } from '../handling';
import { VoyageBuilder } from '../voyage/voyage.builder';
import { VoyageNumber } from '../voyage';
import { Voyage } from '../voyage/voyage.model';
import { ArrayList } from '../../helpers/array-list';
import { HandlingHistory } from '../handling/handling-history';
import { date } from '../../helpers/date';
import { RoutingStatus } from './routing-status';
import { Cargo } from './cargo.model';
import { TrackingId } from './tracking-id';
import { RouteSpecification } from './route.specification';
import { Leg } from './leg.model';
import { Itinerary } from './itinerary.model';
import { TransportStatus } from './transport-status';

const { RECEIVE, LOAD, UNLOAD, CLAIM, CUSTOMS } = HandlingEventType;
const { NOT_ROUTED, MISROUTED, ROUTED } = RoutingStatus;
const {
  HAMBURG,
  HONGKONG,
  MELBOURNE,
  STOCKHOLM,
  SHANGHAI,
  ROTTERDAM,
  GOTHENBURG,
  TOKYO,
  HANGZHOU,
  NEWYORK,
} = LocationSamples;

const voyage = new VoyageBuilder(new VoyageNumber('0123'), STOCKHOLM)
  .addMovement(HAMBURG, date(), date())
  .addMovement(HONGKONG, date(), date())
  .addMovement(MELBOURNE, date(), date())
  .build();

const setUpCargoWithItinerary = (
  origin: Location,
  midpoint: Location,
  destination: Location,
): Cargo => {
  const cargo = new Cargo(
    new TrackingId('CARGO1'),
    new RouteSpecification(origin, destination, date()),
  );

  const itinerary = Itinerary.build([
    new Leg(voyage, origin, midpoint, date(), date()),
    new Leg(voyage, midpoint, destination, date(), date()),
  ]);

  cargo.assignToRoute(itinerary);

  return cargo;
};

describe('domain > model > cargo > Cargo', () => {
  it('Constructor', () => {
    const trackingId = new TrackingId('XYZ');
    const arrivalDeadline = new Date('2009-03-13');
    const routeSpecification = new RouteSpecification(STOCKHOLM, MELBOURNE, arrivalDeadline);
    const cargo = new Cargo(trackingId, routeSpecification);

    expect(cargo.delivery.routingStatus).toBe(NOT_ROUTED);
    expect(cargo.delivery.transportStatus).toBe(TransportStatus.NOT_RECEIVED);
    expect(cargo.delivery.lastKnownLocation).toBe(Location.UNKNOWN);
    expect(cargo.delivery.currentVoyage).toBe(Voyage.NONE);
  });

  it('Routing Status', () => {
    const trackingId = new TrackingId('XYZ');
    const arrivalDeadline = new Date('2009-03-13');
    const routeSpecification = new RouteSpecification(STOCKHOLM, MELBOURNE, arrivalDeadline);
    const cargo = new Cargo(trackingId, routeSpecification);
    const good = Itinerary.build([new Leg(voyage, SHANGHAI, ROTTERDAM, date(), date())]);
    const bad = Itinerary.build([new Leg(voyage, ROTTERDAM, GOTHENBURG, date(), date())]);

    const acceptOnlyGood = new RouteSpecification(
      cargo.origin,
      cargo.routeSpecification.destination,
      new Date(),
    );
    acceptOnlyGood.isSatisfiedBy = (itinerary: Itinerary) => itinerary === good;

    cargo.specifyNewRoute(acceptOnlyGood);
    expect(cargo.delivery.routingStatus.equals(NOT_ROUTED)).toBeTruthy();

    cargo.assignToRoute(bad);
    expect(cargo.delivery.routingStatus.equals(MISROUTED)).toBeTruthy();

    cargo.assignToRoute(good);
    expect(cargo.delivery.routingStatus.equals(ROUTED)).toBeTruthy();
  });

  it('Last Known Location Unknown When No Events', () => {
    const cargo = new Cargo(
      new TrackingId('XYZ'),
      new RouteSpecification(STOCKHOLM, MELBOURNE, date()),
    );
    expect(cargo.delivery.lastKnownLocation.equals(Location.UNKNOWN)).toBeTruthy();
  });

  it('Last Known Location Received', () => {
    const cargo = new Cargo(
      new TrackingId('XYZ'),
      new RouteSpecification(STOCKHOLM, MELBOURNE, date()),
    );
    const he = new HandlingEvent(cargo, date('2007-12-01'), date(), RECEIVE, STOCKHOLM);
    const events = new ArrayList<HandlingEvent>();
    events.add(he);
    cargo.deriveDeliveryProgress(new HandlingHistory(events));
    expect(cargo.delivery.lastKnownLocation.equals(STOCKHOLM)).toBeTruthy();
  });

  it('Last Known Location Claimed', () => {
    const cargo = new Cargo(
      new TrackingId('XYZ'),
      new RouteSpecification(STOCKHOLM, MELBOURNE, new Date()),
    );
    const events = new ArrayList<HandlingEvent>();

    events.add(new HandlingEvent(cargo, date('2007-12-01'), date(), LOAD, STOCKHOLM, voyage));
    events.add(new HandlingEvent(cargo, date('2007-12-02'), date(), UNLOAD, HAMBURG, voyage));

    events.add(new HandlingEvent(cargo, date('2007-12-03'), date(), LOAD, HAMBURG, voyage));
    events.add(new HandlingEvent(cargo, date('2007-12-04'), date(), UNLOAD, HONGKONG, voyage));

    events.add(new HandlingEvent(cargo, date('2007-12-09'), date(), CLAIM, MELBOURNE));
    cargo.deriveDeliveryProgress(new HandlingHistory(events));

    expect(cargo.delivery.lastKnownLocation.equals(MELBOURNE)).toBeTruthy();
  });

  it('Last Known Location Unloaded', () => {
    const cargo = new Cargo(
      new TrackingId('XYZ'),
      new RouteSpecification(STOCKHOLM, MELBOURNE, new Date()),
    );
    const events = new ArrayList<HandlingEvent>();
    events.add(new HandlingEvent(cargo, date('2007-12-01'), date(), LOAD, STOCKHOLM, voyage));
    events.add(new HandlingEvent(cargo, date('2007-12-02'), date(), UNLOAD, HAMBURG, voyage));
    events.add(new HandlingEvent(cargo, date('2007-12-03'), date(), LOAD, HAMBURG, voyage));
    events.add(new HandlingEvent(cargo, date('2007-12-04'), date(), UNLOAD, HONGKONG, voyage));
    cargo.deriveDeliveryProgress(new HandlingHistory(events));

    expect(cargo.delivery.lastKnownLocation.equals(HONGKONG)).toBeTruthy();
  });

  it('Last Known Location Loaded', () => {
    const events = new ArrayList<HandlingEvent>();
    const cargo = new Cargo(
      new TrackingId('XYZ'),
      new RouteSpecification(STOCKHOLM, MELBOURNE, new Date()),
    );
    events.add(new HandlingEvent(cargo, date('2007-12-01'), date(), LOAD, STOCKHOLM, voyage));
    events.add(new HandlingEvent(cargo, date('2007-12-02'), date(), UNLOAD, HAMBURG, voyage));
    events.add(new HandlingEvent(cargo, date('2007-12-03'), date(), LOAD, HAMBURG, voyage));
    cargo.deriveDeliveryProgress(new HandlingHistory(events));

    expect(cargo.delivery.lastKnownLocation.equals(HAMBURG)).toBeTruthy();
  });

  it('Is Unloaded At Final Destination', () => {
    const events = new ArrayList<HandlingEvent>();
    const cargo = setUpCargoWithItinerary(HANGZHOU, TOKYO, NEWYORK);
    expect(cargo.delivery.isUnloadedAtDestination).toBeFalsy();

    // Adding an event unrelated to unloading at final destination
    events.add(new HandlingEvent(cargo, date(10), new Date(), RECEIVE, HANGZHOU));
    cargo.deriveDeliveryProgress(new HandlingHistory(events));
    expect(cargo.delivery.isUnloadedAtDestination).toBeFalsy();

    const voyage2 = new VoyageBuilder(new VoyageNumber('0123'), HANGZHOU)
      .addMovement(NEWYORK, date(), date())
      .build();

    // Adding an unload event, but not at the final destination
    events.add(new HandlingEvent(cargo, date(20), date(), UNLOAD, TOKYO, voyage2));
    cargo.deriveDeliveryProgress(new HandlingHistory(events));
    expect(cargo.delivery.isUnloadedAtDestination).toBeFalsy();

    // Adding an event in the final destination, but not unload
    events.add(new HandlingEvent(cargo, date(30), date(), CUSTOMS, NEWYORK));
    cargo.deriveDeliveryProgress(new HandlingHistory(events));
    expect(cargo.delivery.isUnloadedAtDestination).toBeFalsy();

    // Finally, cargo is unloaded at final destination
    events.add(new HandlingEvent(cargo, date(40), date(), UNLOAD, NEWYORK, voyage2));
    cargo.deriveDeliveryProgress(new HandlingHistory(events));
    expect(cargo.delivery.isUnloadedAtDestination).toBeTruthy();
  });

  describe('Is Misdirected', () => {
    const events = new ArrayList<HandlingEvent>();
    let handlingEvents = new ArrayList<HandlingEvent>();

    it('A cargo with no itinerary is not misdirected', () => {
      const cargo = new Cargo(
        new TrackingId('TRKID'),
        new RouteSpecification(SHANGHAI, GOTHENBURG, new Date()),
      );
      expect(cargo.delivery.isMisdirected).toBeFalsy();
    });

    it('A cargo with no handling events is not misdirected', () => {
      const cargo = setUpCargoWithItinerary(SHANGHAI, ROTTERDAM, GOTHENBURG);
      expect(cargo.delivery.isMisdirected).toBeFalsy();

      // Happy path
      handlingEvents.add(new HandlingEvent(cargo, date(10), date(20), RECEIVE, SHANGHAI));
      handlingEvents.add(new HandlingEvent(cargo, date(30), date(40), LOAD, SHANGHAI, voyage));
      handlingEvents.add(new HandlingEvent(cargo, date(50), date(60), UNLOAD, ROTTERDAM, voyage));
      handlingEvents.add(new HandlingEvent(cargo, date(70), date(80), LOAD, ROTTERDAM, voyage));
      handlingEvents.add(new HandlingEvent(cargo, date(90), date(100), UNLOAD, GOTHENBURG, voyage));
      handlingEvents.add(new HandlingEvent(cargo, date(110), date(120), CLAIM, GOTHENBURG));
      handlingEvents.add(new HandlingEvent(cargo, date(130), date(140), CUSTOMS, GOTHENBURG));

      events.addAll(handlingEvents);
      cargo.deriveDeliveryProgress(new HandlingHistory(events));
      expect(cargo.delivery.isMisdirected).toBeFalsy();
    });

    it('Is Misdirected 1', () => {
      const cargo = setUpCargoWithItinerary(SHANGHAI, ROTTERDAM, GOTHENBURG);
      handlingEvents = new ArrayList<HandlingEvent>();

      const d = date();
      handlingEvents.add(new HandlingEvent(cargo, d, date(), RECEIVE, HANGZHOU));
      events.addAll(handlingEvents);
      cargo.deriveDeliveryProgress(new HandlingHistory(events));

      expect(cargo.delivery.isMisdirected).toBeTruthy();
    });

    it('Is Misdirected 2', () => {
      const cargo = setUpCargoWithItinerary(SHANGHAI, ROTTERDAM, GOTHENBURG);
      handlingEvents = new ArrayList<HandlingEvent>();

      handlingEvents.add(new HandlingEvent(cargo, date(10), date(20), RECEIVE, SHANGHAI));
      handlingEvents.add(new HandlingEvent(cargo, date(30), date(40), LOAD, SHANGHAI, voyage));
      handlingEvents.add(new HandlingEvent(cargo, date(50), date(60), UNLOAD, ROTTERDAM, voyage));
      handlingEvents.add(new HandlingEvent(cargo, date(70), date(80), LOAD, ROTTERDAM, voyage));

      events.addAll(handlingEvents);
      cargo.deriveDeliveryProgress(new HandlingHistory(events));

      expect(cargo.delivery.isMisdirected).toBeTruthy();
    });

    it('Is Misdirected 3', () => {
      const cargo = setUpCargoWithItinerary(SHANGHAI, ROTTERDAM, GOTHENBURG);
      handlingEvents = new ArrayList<HandlingEvent>();

      handlingEvents.add(new HandlingEvent(cargo, date(10), date(20), RECEIVE, SHANGHAI));
      handlingEvents.add(new HandlingEvent(cargo, date(30), date(40), LOAD, SHANGHAI, voyage));
      handlingEvents.add(new HandlingEvent(cargo, date(50), date(60), UNLOAD, ROTTERDAM, voyage));
      handlingEvents.add(new HandlingEvent(cargo, date(), date(), CLAIM, ROTTERDAM));

      events.addAll(handlingEvents);
      cargo.deriveDeliveryProgress(new HandlingHistory(events));

      expect(cargo.delivery.isMisdirected).toBeTruthy();
    });
  });

  it('Equality', () => {
    const spec1 = new RouteSpecification(STOCKHOLM, HONGKONG, new Date());
    const spec2 = new RouteSpecification(STOCKHOLM, MELBOURNE, new Date());
    const c1 = new Cargo(new TrackingId('ABC'), spec1);
    const c2 = new Cargo(new TrackingId('CBA'), spec1);
    const c3 = new Cargo(new TrackingId('ABC'), spec2);
    const c4 = new Cargo(new TrackingId('ABC'), spec1);

    expect(c1.equals(c4)).toBeTruthy(); // Cargos should be equal when TrackingIDs are equal
    expect(c1.equals(c3)).toBeTruthy(); // Cargos should be equal when TrackingIDs are equal
    expect(c3.equals(c4)).toBeTruthy(); // Cargos should be equal when TrackingIDs are equal
    expect(c1.equals(c2)).toBeFalsy(); // Cargos are not equal when TrackingID differ
  });
});
