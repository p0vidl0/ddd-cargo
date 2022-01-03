import { LocationSamples } from '../location';
import { CarrierMovement } from './carrier-movement.model';

describe('model > voyage > CarrierMovement', () => {
  describe('Constructor', () => {
    it('Should not accept null constructor arguments 1', () => {
      const func = () => new CarrierMovement(null, null, new Date(), new Date());
      expect(func).toThrow();
    });

    it('Should not accept null constructor arguments 2', () => {
      const func = () =>
        new CarrierMovement(LocationSamples.STOCKHOLM, null, new Date(), new Date());
      expect(func).toThrow();
    });

    it('Legal', () => {
      const c = new CarrierMovement(
        LocationSamples.STOCKHOLM,
        LocationSamples.HAMBURG,
        new Date(),
        new Date(),
      );
      expect(c.equals(c)).toBeTruthy();
    });
  });

  describe('Same Value As and Equals', () => {
    const date = new Date();
    const cm1 = new CarrierMovement(
      LocationSamples.STOCKHOLM,
      LocationSamples.HAMBURG,
      new Date(date),
      new Date(date),
    );
    const cm2 = new CarrierMovement(
      LocationSamples.STOCKHOLM,
      LocationSamples.HAMBURG,
      new Date(date),
      new Date(date),
    );
    const cm3 = new CarrierMovement(
      LocationSamples.HAMBURG,
      LocationSamples.STOCKHOLM,
      new Date(date),
      new Date(date),
    );
    const cm4 = new CarrierMovement(
      LocationSamples.HAMBURG,
      LocationSamples.STOCKHOLM,
      new Date(date),
      new Date(date),
    );

    it('Same Value As', () => {
      expect(cm1.sameValueAs(cm2)).toBeTruthy();
      expect(cm2.sameValueAs(cm3)).toBeFalsy();
      expect(cm3.sameValueAs(cm4)).toBeTruthy();
    });

    it('Equals', () => {
      expect(cm1.equals(cm2)).toBeTruthy();
      expect(cm2.equals(cm3)).toBeFalsy();
      expect(cm3.equals(cm4)).toBeTruthy();
    });
  });
});
