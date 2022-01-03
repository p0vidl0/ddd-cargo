import { SampleDataGenerator } from './sample-data-generator';

export default class SampleDataGeneratorService {
  constructor(private generator: SampleDataGenerator) {}

  async apply() {
    await this.generator.generate();
  }
}
