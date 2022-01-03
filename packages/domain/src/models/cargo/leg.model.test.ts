import { Leg } from './leg.model';

describe('domain > model > cargo > Leg', () => {
  it('Constructor', () => {
    const func = () => new Leg(null, null, null, null, null);

    expect(func).toThrow();
  });
});
