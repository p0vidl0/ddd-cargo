import { LocationSamples } from '../location';
import { HandlingEventType, HandlingEvent } from '../handling';
import { VoyageBuilder } from '../voyage/voyage.builder';
import { VoyageNumber } from '../voyage';
import { date } from '../../helpers/date';
import { TrackingId } from './tracking-id';
import { RouteSpecification } from './route.specification';
import { Cargo } from './cargo.model';
import { Itinerary } from './itinerary.model';
import { Leg } from './leg.model';

const { SHANGHAI, ROTTERDAM, GOTHENBURG, NEWYORK, STOCKHOLM, HELSINKI, HANGZHOU } = LocationSamples;
const { RECEIVE, LOAD, UNLOAD, CLAIM, CUSTOMS } = HandlingEventType;

describe('domain > model > cargo > Itinerary', () => {
  const voyage = new VoyageBuilder(new VoyageNumber('0123'), SHANGHAI)
    .addMovement(ROTTERDAM, date(), date())
    .addMovement(GOTHENBURG, date(), date())
    .build();

  const wrongVoyage = new VoyageBuilder(new VoyageNumber('0321'), NEWYORK)
    .addMovement(STOCKHOLM, date(), date())
    .addMovement(HELSINKI, date(), date())
    .build();

  describe('Cargo On Track', () => {
    const trackingId = new TrackingId('CARGO1');
    const routeSpecification = new RouteSpecification(SHANGHAI, GOTHENBURG, date());
    const cargo = new Cargo(trackingId, routeSpecification);
    const itinerary = Itinerary.build([
      new Leg(voyage, SHANGHAI, ROTTERDAM, date(), date()),
      new Leg(voyage, ROTTERDAM, GOTHENBURG, date(), date()),
    ]);

    it('Happy path', () => {
      let event = new HandlingEvent(cargo, date(), date(), RECEIVE, SHANGHAI);
      expect(itinerary.isExpected(event)).toBeTruthy();

      event = new HandlingEvent(cargo, date(), date(), LOAD, SHANGHAI, voyage);
      expect(itinerary.isExpected(event)).toBeTruthy();

      event = new HandlingEvent(cargo, date(), date(), UNLOAD, ROTTERDAM, voyage);
      expect(itinerary.isExpected(event)).toBeTruthy();

      event = new HandlingEvent(cargo, date(), date(), LOAD, ROTTERDAM, voyage);
      expect(itinerary.isExpected(event)).toBeTruthy();

      event = new HandlingEvent(cargo, date(), date(), UNLOAD, GOTHENBURG, voyage);
      expect(itinerary.isExpected(event)).toBeTruthy();

      event = new HandlingEvent(cargo, date(), date(), CLAIM, GOTHENBURG);
      expect(itinerary.isExpected(event)).toBeTruthy();
    });

    it('Customs event changes nothing', () => {
      const event = new HandlingEvent(cargo, date(), date(), CUSTOMS, GOTHENBURG);
      expect(itinerary.isExpected(event)).toBeTruthy();
    });

    it('Received at the wrong location', () => {
      const event = new HandlingEvent(cargo, date(), date(), RECEIVE, HANGZHOU);
      expect(itinerary.isExpected(event)).toBeFalsy();
    });

    it('Loaded to onto the wrong ship, correct location', () => {
      const event = new HandlingEvent(cargo, date(), date(), LOAD, ROTTERDAM, wrongVoyage);
      expect(itinerary.isExpected(event)).toBeFalsy();
    });

    it('Unloaded from the wrong ship in the wrong location', () => {
      let event = new HandlingEvent(cargo, date(), date(), LOAD, HELSINKI, wrongVoyage);
      expect(itinerary.isExpected(event)).toBeFalsy();

      event = new HandlingEvent(cargo, date(), date(), CLAIM, ROTTERDAM);
      expect(itinerary.isExpected(event)).toBeFalsy();
    });
  });

  describe('Create Itinerary', () => {
    it('Undefined itinerary is not OK', () => {
      const func = () => Itinerary.build([]);
      expect(func).toThrow();
    });
    it('Null itinerary is not OK', () => {
      const func = () => Itinerary.build(null);
      expect(func).toThrow();
    });
  });
});
