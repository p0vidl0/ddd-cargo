import { AlwaysTrueSpecification } from './always.true.specification';
import { AlwaysFalseSpecification } from './always.false.specification';
import { NotSpecification } from './not.specification';

describe('domain > shared > NotSpecification', () => {
  const trueSpec = new AlwaysTrueSpecification<object>();
  const falseSpec = new AlwaysFalseSpecification<object>();

  it('Should be false for AlwaysTrueSpec', () => {
    const notSpecification = new NotSpecification<object>(trueSpec);
    expect(notSpecification.isSatisfiedBy({})).toBeFalsy();
  });
  it('Should be true for AlwaysFalseSpec', () => {
    const notSpecification = new NotSpecification<object>(falseSpec);
    expect(notSpecification.isSatisfiedBy({})).toBeTruthy();
  });
});
