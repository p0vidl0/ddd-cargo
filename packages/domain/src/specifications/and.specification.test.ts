import { AlwaysTrueSpecification } from './always.true.specification';
import { AlwaysFalseSpecification } from './always.false.specification';
import { AndSpecification } from './and.specification';

describe('domain > shared > AndSpecification', () => {
  const trueSpec = new AlwaysTrueSpecification<object>();
  const falseSpec = new AlwaysFalseSpecification<object>();

  it('Should be true for AlwaysTrueSpec and AlwaysTrueSpec', () => {
    const andSpecification = new AndSpecification<object>(trueSpec, trueSpec);
    expect(andSpecification.isSatisfiedBy({})).toBeTruthy();
  });
  it('Should be false for AlwaysFalseSpec and AlwaysTrueSpec', () => {
    const andSpecification = new AndSpecification<object>(falseSpec, trueSpec);
    expect(andSpecification.isSatisfiedBy({})).toBeFalsy();
  });
  it('Should be false for AlwaysTrueSpec and AlwaysFalseSpec', () => {
    const andSpecification = new AndSpecification<object>(trueSpec, falseSpec);
    expect(andSpecification.isSatisfiedBy({})).toBeFalsy();
  });
  it('Should be false for AlwaysFalseSpec and AlwaysFalseSpec', () => {
    const andSpecification = new AndSpecification<object>(falseSpec, falseSpec);
    expect(andSpecification.isSatisfiedBy({})).toBeFalsy();
  });
});
