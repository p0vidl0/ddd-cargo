import { LocationSamples } from '../location';
import { VoyageBuilder } from './voyage.builder';
import { VoyageNumber } from './voyage-number.model';
import { Voyage } from './voyage.model';

export class VoyageSamples {
  static v100 = new VoyageBuilder(new VoyageNumber('V100'), LocationSamples.HONGKONG)
    .addMovement(LocationSamples.TOKYO, new Date('2009-03-03'), new Date('2009-03-05'))
    .addMovement(LocationSamples.NEWYORK, new Date('2009-03-06'), new Date('2009-03-09'))
    .build();

  static v200 = new VoyageBuilder(new VoyageNumber('V200'), LocationSamples.NEWYORK)
    .addMovement(LocationSamples.CHICAGO, new Date('2009-03-03'), new Date('2009-03-05'))
    .build();

  static all = new Map<string, Voyage>();

  static init() {
    VoyageSamples.all.set(VoyageSamples.v100.voyageNumber.idString(), VoyageSamples.v100);
    VoyageSamples.all.set(VoyageSamples.v200.voyageNumber.idString(), VoyageSamples.v200);
  }

  static lookup(voyageNumber: VoyageNumber): Voyage {
    return VoyageSamples.all.get(voyageNumber.idString());
  }
}

VoyageSamples.init();
