import { AlwaysTrueSpecification } from './always.true.specification';
import { AlwaysFalseSpecification } from './always.false.specification';
import { OrSpecification } from './or.specification';

describe('domain > shared > OrSpecification', () => {
  const trueSpec = new AlwaysTrueSpecification<object>();
  const falseSpec = new AlwaysFalseSpecification<object>();

  it('Should be true for AlwaysTrueSpec and AlwaysTrueSpec', () => {
    const orSpecification = new OrSpecification<object>(trueSpec, trueSpec);
    expect(orSpecification.isSatisfiedBy({})).toBeTruthy();
  });
  it('Should be true for AlwaysFalseSpec and AlwaysTrueSpec', () => {
    const orSpecification = new OrSpecification<object>(falseSpec, trueSpec);
    expect(orSpecification.isSatisfiedBy({})).toBeTruthy();
  });
  it('Should be true for AlwaysTrueSpec and AlwaysFalseSpec', () => {
    const orSpecification = new OrSpecification<object>(trueSpec, falseSpec);
    expect(orSpecification.isSatisfiedBy({})).toBeTruthy();
  });
  it('Should be false for AlwaysFalseSpec and AlwaysFalseSpec', () => {
    const orSpecification = new OrSpecification<object>(falseSpec, falseSpec);
    expect(orSpecification.isSatisfiedBy({})).toBeFalsy();
  });
});
