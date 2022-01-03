import _ = require('lodash');

export class StringBuilder {
  private strings: string[];

  constructor(initial: string) {
    this.strings.push(initial);
  }

  append(value: any) {
    if (_.isEmpty(value)) return this;
    if (typeof value === 'string') {
      this.strings.push(value);
    } else if (typeof value.toString() === 'function') {
      this.strings.push(value.toString());
    }
    return this;
  }

  toString() {
    return this.strings.join('');
  }
}
