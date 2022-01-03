import { UnLocode } from './un-locode.model';

const isValid = (code: string) => {
  const unLocode = new UnLocode(code);
  expect(unLocode.toString()).toBe(code);
};

const isInvalid = (code: string) => {
  expect(() => new UnLocode(code)).toThrow();
};

describe('models > location > UnLocode', () => {
  it('Creation Success', () => {
    isValid('AA234');
    isValid('AAA9B');
    isValid('AAAAA');
  });

  it('Creation Fail', () => {
    isInvalid('AAAA');
    isInvalid('AAAAAA');
    isInvalid('22AAA');
    isInvalid('AA111');
    isInvalid(null);
  });

  it('Get ID String', () => {
    const unLocode = new UnLocode('AbcDe');
    expect(unLocode.idString()).toBe('ABCDE');
  });

  it('Equals true', () => {
    const allCaps = new UnLocode('ABCDE');
    const mixedCase = new UnLocode('aBcDe');

    expect(allCaps.equals(mixedCase)).toBeTruthy();
    expect(mixedCase.equals(allCaps)).toBeTruthy();
    expect(allCaps.equals(allCaps)).toBeTruthy();
  });

  it('Equals false', () => {
    const allCaps = new UnLocode('ABCDE');

    expect(allCaps.equals(null)).toBeFalsy();
    expect(allCaps.equals(new UnLocode('FGHIJ'))).toBeFalsy();
  });
});
