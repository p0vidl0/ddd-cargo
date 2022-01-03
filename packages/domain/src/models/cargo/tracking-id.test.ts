import { TrackingId } from './tracking-id';

describe('domain > model > cargo > TrackingId', () => {
  it('Constructor', () => {
    const func = () => new TrackingId(null);
    expect(func).toThrow();
  });
});
