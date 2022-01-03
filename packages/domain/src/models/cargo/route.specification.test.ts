import { VoyageBuilder } from '../voyage/voyage.builder';
import { VoyageNumber } from '../voyage';
import { LocationSamples } from '../location';
import { Itinerary } from './itinerary.model';
import { Leg } from './leg.model';
import { RouteSpecification } from './route.specification';

describe('model > cargo > RouteSpecification', () => {
  const hongKongTokyoNewYork = new VoyageBuilder(new VoyageNumber('V001'), LocationSamples.HONGKONG)
    .addMovement(LocationSamples.TOKYO, new Date('2009-02-01'), new Date('2009-02-05'))
    .addMovement(LocationSamples.NEWYORK, new Date('2009-02-06'), new Date('2009-02-10'))
    .addMovement(LocationSamples.HONGKONG, new Date('2009-02-11'), new Date('2009-02-14'))
    .build();
  const dallasNewYorkChicago = new VoyageBuilder(new VoyageNumber('V002'), LocationSamples.DALLAS)
    .addMovement(LocationSamples.NEWYORK, new Date('2009-02-06'), new Date('2009-02-07'))
    .addMovement(LocationSamples.CHICAGO, new Date('2009-02-12'), new Date('2009-02-20'))
    .build();

  // TODO:
  // it shouldn't be possible to create Legs that have load/unload locations
  // and/or dates that don't match the voyage's carrier movements.
  const itinerary = Itinerary.build([
    new Leg(
      hongKongTokyoNewYork,
      LocationSamples.HONGKONG,
      LocationSamples.NEWYORK,
      new Date('2009-02-01'),
      new Date('2009-02-10'),
    ),
    new Leg(
      dallasNewYorkChicago,
      LocationSamples.NEWYORK,
      LocationSamples.CHICAGO,
      new Date('2009-02-12'),
      new Date('2009-02-20'),
    ),
  ]);

  it('Is Satisfied By -> Success', () => {
    const routeSpecification = new RouteSpecification(
      LocationSamples.HONGKONG,
      LocationSamples.CHICAGO,
      new Date('2009-03-01'),
    );
    expect(routeSpecification.isSatisfiedBy(itinerary)).toBeTruthy();
  });

  it('Is Satisfied By -> Wrong Origin', () => {
    const routeSpecification = new RouteSpecification(
      LocationSamples.HANGZHOU,
      LocationSamples.CHICAGO,
      new Date('2009-03-01'),
    );
    expect(routeSpecification.isSatisfiedBy(itinerary)).toBeFalsy();
  });

  it('Is Satisfied By -> Wrong Destination', () => {
    const routeSpecification = new RouteSpecification(
      LocationSamples.HONGKONG,
      LocationSamples.NEWYORK,
      new Date('2009-03-01'),
    );
    expect(routeSpecification.isSatisfiedBy(itinerary)).toBeFalsy();
  });

  it('Is Satisfied By -> Missed Deadline', () => {
    const routeSpecification = new RouteSpecification(
      LocationSamples.HONGKONG,
      LocationSamples.CHICAGO,
      new Date('2009-02-15'),
    );
    expect(routeSpecification.isSatisfiedBy(itinerary)).toBeFalsy();
  });
});
