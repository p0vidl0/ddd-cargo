/**
 * Builder pattern is used for incremental construction
 * of a Voyage aggregate. This serves as an aggregate factory.
 */
import { Validate } from '../../helpers/validate.helper';
import { Location } from '../location';
import { ArrayList } from '../../helpers/array-list';
import { CarrierMovement } from './carrier-movement.model';
import { VoyageNumber } from './voyage-number.model';
import { Voyage } from './voyage.model';
import { Schedule } from './schedule.model';

export class VoyageBuilder {
  private carrierMovements: ArrayList<CarrierMovement> = new ArrayList<CarrierMovement>();

  private readonly voyageNumber: VoyageNumber;

  private departureLocation: Location;

  constructor(voyageNumber: VoyageNumber, departureLocation: Location) {
    Validate.notNil(voyageNumber, 'Voyage number is required');
    Validate.notNil(departureLocation, 'Departure location is required');

    this.voyageNumber = voyageNumber;
    this.departureLocation = departureLocation;
  }

  addMovement(arrivalLocation: Location, departureTime: Date, arrivalTime: Date): VoyageBuilder {
    const newCarrierMovement = new CarrierMovement(
      this.departureLocation,
      arrivalLocation,
      departureTime,
      arrivalTime,
    );
    this.carrierMovements.add(newCarrierMovement);
    // Next departure location is the same as this arrival location
    this.departureLocation = arrivalLocation;
    return this;
  }

  build(): Voyage {
    return new Voyage(this.voyageNumber, Schedule.build(this.carrierMovements.toArray()));
  }
}
