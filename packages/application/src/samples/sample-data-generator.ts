import { DateTime } from 'luxon';
import {
  HandlingEventFactory,
  ICargoRepository,
  IHandlingEventRepository,
  ILocationRepository,
  IVoyageRepository,
  LocationSamples,
} from '@ddd-cargo/domain';

// // eslint-disable-next-line arrow-parens
// const requireNonNull = <T>(v: T) => {
//   if (!v) throw new Error();
//   return v;
// };

const baseDate = new Date('2008-01-01').getTime();

// eslint-disable-next-line @typescript-eslint/no-use-before-define
const ts = (hours) => DateTime.fromMillis(baseDate).plus({ hours }).toISO();

export class SampleDataGenerator {
  cargoRepository: ICargoRepository;
  private voyageRepository: IVoyageRepository;
  private locationRepository: ILocationRepository;
  private handlingEventRepository: IHandlingEventRepository;

  private static loadHandlingEventData(): void {
    // eslint-disable-next-line unused-imports/no-unused-vars-ts
    const handlingEventArgs = [
      // XYZ (SESTO-FIHEL-DEHAM-CNHKG-JPTOK-AUMEL)
      [ts(0), ts(0), 'RECEIVE', 1, null, 1],
      [ts(4), ts(5), 'LOAD', 1, 1, 1],
      [ts(14), ts(14), 'UNLOAD', 5, 1, 1],
      [ts(15), ts(15), 'LOAD', 5, 1, 1],
      [ts(30), ts(30), 'UNLOAD', 6, 1, 1],
      [ts(33), ts(33), 'LOAD', 6, 1, 1],
      [ts(34), ts(34), 'UNLOAD', 3, 1, 1],
      [ts(60), ts(60), 'LOAD', 3, 1, 1],
      [ts(70), ts(71), 'UNLOAD', 4, 1, 1],
      [ts(75), ts(75), 'LOAD', 4, 1, 1],
      [ts(88), ts(88), 'UNLOAD', 2, 1, 1],
      [ts(100), ts(102), 'CLAIM', 2, null, 1],

      // ZYX (AUMEL - USCHI - DEHAM -)
      [ts(200), ts(201), 'RECEIVE', 2, null, 3],
      [ts(202), ts(202), 'LOAD', 2, 2, 3],
      [ts(208), ts(208), 'UNLOAD', 7, 2, 3],
      [ts(212), ts(212), 'LOAD', 7, 2, 3],
      [ts(230), ts(230), 'UNLOAD', 6, 2, 3],
      [ts(235), ts(235), 'LOAD', 6, 2, 3],

      // ABC
      [ts(20), ts(21), 'CLAIM', 2, null, 2],

      // CBA
      [ts(0), ts(1), 'RECEIVE', 2, null, 4],
      [ts(10), ts(11), 'LOAD', 2, 2, 4],
      [ts(20), ts(21), 'UNLOAD', 7, 2, 4],

      // FGH
      [ts(100), ts(160), 'RECEIVE', 3, null, 5],
      [ts(150), ts(110), 'LOAD', 3, 3, 5],

      // JKL
      [ts(200), ts(220), 'RECEIVE', 6, null, 6],
      [ts(300), ts(330), 'LOAD', 6, 3, 6],
      [ts(400), ts(440), 'UNLOAD', 5, 3, 6], // Unexpected event
    ];
    // executeUpdate(jdbcTemplate, handlingEventSql, handlingEventArgs);
  }

  // private static loadCarrierMovementData(): void {
  //   const voyageArgs = {
  //     { 1, '0101' },
  //     { 2, '0202' },
  //     { 3, '0303' }
  //   };
  //   // executeUpdate(jdbcTemplate, voyageSql, voyageArgs);
  //
  //   String carrierMovementSql =
  //     'insert into CarrierMovement (id, voyage_id,
  //     departure_location_id, arrival_location_id, departure_time, arrival_time, cm_index) ' +
  //     'values (?,?,?,?,?,?,?)';
  //
  //   Object[][] carrierMovementArgs = {
  //   // SESTO - FIHEL - DEHAM - CNHKG - JPTOK - AUMEL (voyage 0101)
  //   {1, 1, 1, 5, ts(1), ts(2), 0},
  //   {2, 1, 5, 6, ts(1), ts(2), 1},
  //   {3, 1, 6, 3, ts(1), ts(2), 2},
  //   {4, 1, 3, 4, ts(1), ts(2), 3},
  //   {5, 1, 4, 2, ts(1), ts(2), 4},
  //
  //   // AUMEL - USCHI - DEHAM - SESTO - FIHEL (voyage 0202)
  //   {7, 2, 2, 7, ts(1), ts(2), 0},
  //   {8, 2, 7, 6, ts(1), ts(2), 1},
  //   {9, 2, 6, 1, ts(1), ts(2), 2},
  //   {6, 2, 1, 5, ts(1), ts(2), 3},
  //
  //   // CNHKG - AUMEL - FIHEL - DEHAM - SESTO - USCHI - JPTKO (voyage 0303)
  //   {10, 3, 3, 2, ts(1), ts(2), 0},
  //   {11, 3, 2, 5, ts(1), ts(2), 1},
  //   {12, 3, 6, 1, ts(1), ts(2), 2},
  //   {13, 3, 1, 7, ts(1), ts(2), 3},
  //   {14, 3, 7, 4, ts(1), ts(2), 4}
  // };
  //   executeUpdate(jdbcTemplate, carrierMovementSql, carrierMovementArgs);
  // }

  // private static loadCargoData(): void {
  //   const cargoArgs = {
  //     {1, 'XYZ', 1, 1, 2, ts(10), 'IN_PORT', null, 1, false, 'ROUTED', ts(100), false},
  //     {2, 'ABC', 1, 1, 5, ts(20), 'IN_PORT', null, 1, false, 'ROUTED', ts(100), false},
  //     {3, 'ZYX', 2, 2, 1, ts(30), 'IN_PORT', null, 1, false, 'NOT_ROUTED', ts(100), false},
  //     {4, 'CBA', 5, 5, 1, ts(40), 'IN_PORT', null, 1, false, 'MISROUTED', ts(100), false},
  //     {5, 'FGH', 1, 3, 5, ts(50), 'IN_PORT', null, 1,
  //     false, 'ROUTED', ts(100), false},  // Cargo origin differs from spec origin
  //     {6, 'JKL', 6, 6, 4, ts(60), 'IN_PORT', null, 1, true, 'ROUTED', ts(100), false}
  //   };
  //   // executeUpdate(jdbcTemplate, cargoSql, cargoArgs);
  // }

  // private static loadLocationData(): void {
  //   const locationArgs = {
  //     {1, 'SESTO', 'Stockholm'},
  //     {2, 'AUMEL', 'Melbourne'},
  //     {3, 'CNHKG', 'Hongkong'},
  //     {4, 'JPTOK', 'Tokyo'},
  //     {5, 'FIHEL', 'Helsinki'},
  //     {6, 'DEHAM', 'Hamburg'},
  //     {7, 'USCHI', 'Chicago'}
  //   };
  //   // executeUpdate(jdbcTemplate, locationSql, locationArgs);
  // }

  // private static loadItineraryData(): void {
  //   const legArgs = {
  //     // Cargo 5: Hongkong - Melbourne - Stockholm - Helsinki
  //     {1, 5, 1, 3, 2, ts(1), ts(2), 0},
  //     {2, 5, 1, 2, 1, ts(3), ts(4), 1},
  //     {3, 5, 1, 1, 5, ts(4), ts(5), 2},
  //     // Cargo 6: Hamburg - Stockholm - Chicago - Tokyo
  //     {4, 6, 2, 6, 1, ts(1), ts(2), 0},
  //     {5, 6, 2, 1, 7, ts(3), ts(4), 1},
  //     {6, 6, 2, 7, 4, ts(5), ts(6), 2}
  //   };
  //   // executeUpdate(jdbcTemplate, legSql, legArgs);
  // }

  async generate(): Promise<void> {
    // TransactionTemplate tt = new TransactionTemplate(transactionManager);
    // loadSampleData(new JdbcTemplate(dataSource), tt);

    const handlingEventFactory = new HandlingEventFactory(
      this.cargoRepository,
      this.voyageRepository,
      this.locationRepository,
    );

    await this.loadHibernateData(handlingEventFactory, this.handlingEventRepository);
  }

  async loadHibernateData(
    _handlingEventFactory: HandlingEventFactory,
    _handlingEventRepository: IHandlingEventRepository,
  ): Promise<void> {
    console.log('*** Loading Hibernate data ***');

    const locations = LocationSamples.getAll();

    await Promise.all(locations.map((location) => this.locationRepository.store(location)));

    console.log('*** Hibernate data is loaded ***');

    // tt.execute(new TransactionCallbackWithoutResult() {
    // @Override
    // protected void doInTransactionWithoutResult(TransactionStatus status) {
    //   Session session = sf.getCurrentSession();
    //
    //   for (Location location : SampleLocations.getAll()) {
    //     session.save(location);
    //   }
    //
    //   session.save(HONGKONG_TO_NEW_YORK);
    //   session.save(NEW_YORK_TO_DALLAS);
    //   session.save(DALLAS_TO_HELSINKI);
    //   session.save(HELSINKI_TO_HONGKONG);
    //   session.save(DALLAS_TO_HELSINKI_ALT);
    //
    //   RouteSpecification routeSpecification = new RouteSpecification(HONGKONG, HELSINKI, toDate('2009-03-15'));
    //   TrackingId trackingId = new TrackingId('ABC123');
    //   Cargo abc123 = new Cargo(trackingId, routeSpecification);
    //
    //   Itinerary itinerary = new Itinerary(asList(
    //     new Leg(HONGKONG_TO_NEW_YORK, HONGKONG, NEWYORK, toDate('2009-03-02'), toDate('2009-03-05')),
    //     new Leg(NEW_YORK_TO_DALLAS, NEWYORK, DALLAS, toDate('2009-03-06'), toDate('2009-03-08')),
    //     new Leg(DALLAS_TO_HELSINKI, DALLAS, HELSINKI, toDate('2009-03-09'), toDate('2009-03-12'))
    //   ));
    //   abc123.assignToRoute(itinerary);
    //
    //   session.save(abc123);
    //
    //   try {
    //     HandlingEvent event1 = handlingEventFactory.createHandlingEvent(
    //       new Date(), toDate('2009-03-01'), trackingId, null, HONGKONG.unLocode(), HandlingEvent.Type.RECEIVE
    //     );
    //     session.save(event1);
    //
    //     HandlingEvent event2 = handlingEventFactory.createHandlingEvent(
    //       new Date(), toDate('2009-03-02'),
    //       trackingId, HONGKONG_TO_NEW_YORK.voyageNumber(), HONGKONG.unLocode(), HandlingEvent.Type.LOAD
    //     );
    //     session.save(event2);
    //
    //     HandlingEvent event3 = handlingEventFactory.createHandlingEvent(
    //       new Date(), toDate('2009-03-05'),
    //       trackingId, HONGKONG_TO_NEW_YORK.voyageNumber(), NEWYORK.unLocode(), HandlingEvent.Type.UNLOAD
    //     );
    //     session.save(event3);
    //   } catch (CannotCreateHandlingEventException e) {
    //     throw new RuntimeException(e);
    //   }
    //
    //   HandlingHistory handlingHistory = handlingEventRepository.lookupHandlingHistoryOfCargo(trackingId);
    //   abc123.deriveDeliveryProgress(handlingHistory);
    //
    //   session.update(abc123);
    //
    //   // Cargo JKL567
    //
    //   RouteSpecification routeSpecification1 = new RouteSpecification(HANGZOU, STOCKHOLM, toDate('2009-03-18'));
    //   TrackingId trackingId1 = new TrackingId('JKL567');
    //   Cargo jkl567 = new Cargo(trackingId1, routeSpecification1);
    //
    //   Itinerary itinerary1 = new Itinerary(asList(
    //     new Leg(HONGKONG_TO_NEW_YORK, HANGZOU, NEWYORK, toDate('2009-03-03'), toDate('2009-03-05')),
    //     new Leg(NEW_YORK_TO_DALLAS, NEWYORK, DALLAS, toDate('2009-03-06'), toDate('2009-03-08')),
    //     new Leg(DALLAS_TO_HELSINKI, DALLAS, STOCKHOLM, toDate('2009-03-09'), toDate('2009-03-11'))
    //   ));
    //   jkl567.assignToRoute(itinerary1);
    //
    //   session.save(jkl567);
    //
    //   try {
    //     HandlingEvent event1 = handlingEventFactory.createHandlingEvent(
    //       new Date(), toDate('2009-03-01'), trackingId1, null, HANGZOU.unLocode(), HandlingEvent.Type.RECEIVE
    //     );
    //     session.save(event1);
    //
    //     HandlingEvent event2 = handlingEventFactory.createHandlingEvent(
    //       new Date(), toDate('2009-03-03'),
    //       trackingId1, HONGKONG_TO_NEW_YORK.voyageNumber(), HANGZOU.unLocode(), HandlingEvent.Type.LOAD
    //     );
    //     session.save(event2);
    //
    //     HandlingEvent event3 = handlingEventFactory.createHandlingEvent(
    //       new Date(), toDate('2009-03-05'),
    //       trackingId1, HONGKONG_TO_NEW_YORK.voyageNumber(), NEWYORK.unLocode(), HandlingEvent.Type.UNLOAD
    //     );
    //     session.save(event3);
    //
    //     HandlingEvent event4 = handlingEventFactory.createHandlingEvent(
    //       new Date(), toDate('2009-03-06'),
    //       trackingId1, HONGKONG_TO_NEW_YORK.voyageNumber(), NEWYORK.unLocode(), HandlingEvent.Type.LOAD
    //     );
    //     session.save(event4);
    //
    //   } catch (CannotCreateHandlingEventException e) {
    //     throw new RuntimeException(e);
    //   }
    //
    //   HandlingHistory handlingHistory1 = handlingEventRepository.lookupHandlingHistoryOfCargo(trackingId1);
    //   jkl567.deriveDeliveryProgress(handlingHistory1);
    //
    //   session.update(jkl567);
    // }
    // });
  }

  // public static loadSampleData(): void {
  //   transactionTemplate.execute(new TransactionCallbackWithoutResult() {
  //   protected void doInTransactionWithoutResult(TransactionStatus status) {
  //       loadLocationData(jdbcTemplate);
  //       loadCarrierMovementData(jdbcTemplate);
  //       loadCargoData(jdbcTemplate);
  //       loadItineraryData(jdbcTemplate);
  //       loadHandlingEventData(jdbcTemplate);
  //     }
  //   });
  // }
  //
  // private static executeUpdate(JdbcTemplate jdbcTemplate, String sql, Object[][] args): void {
  //   for (Object[] arg : args) {
  //     jdbcTemplate.update(sql, arg);
  //   }
  // }
  //
  // private static Timestamp ts(int hours) {
  //   return new Timestamp(base.getTime() + 1000L * 60 * 60 * hours);
  // }
  //
  // public static Date offset(int hours) {
  //   return new Date(ts(hours).getTime());
  // }
}
