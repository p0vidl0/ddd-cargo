import { Location } from './location.model';
import { UnLocode } from './un-locode.model';

describe('models > location > Location', () => {
  it('Same UN locode - equal', () => {
    const location1 = new Location(new UnLocode('ATEST'), 'test-name');
    const location2 = new Location(new UnLocode('ATEST'), 'test-name');
    expect(location1.equals(location2)).toBeTruthy();
  });

  it('Different UN locodes - not equal', () => {
    const location1 = new Location(new UnLocode('ATEST'), 'test-name');
    const location2 = new Location(new UnLocode('TESTB'), 'test-name');
    expect(location1.equals(location2)).toBeFalsy();
  });

  it('Always equal to itself', () => {
    const location1 = new Location(new UnLocode('ATEST'), 'test-name');
    expect(location1.equals(location1)).toBeTruthy();
  });

  it('Never equal to null', () => {
    const location1 = new Location(new UnLocode('ATEST'), 'test-name');
    expect(location1.equals(null)).toBeFalsy();
  });

  it('Special UNKNOWN location is equal to itself', () => {
    expect(Location.UNKNOWN.equals(Location.UNKNOWN)).toBeTruthy();
  });

  it('Should not allow any null constructor arguments', () => {
    const func = () => new Location(null, null);
    expect(func).toThrow();
  });
});
