import { HandlingEventType, TrackingId, UnLocode, VoyageNumber } from '@ddd-cargo/domain';
import { ISerializable } from '../types/serializable.interface';

export class HandlingEventRegistrationAttempt implements ISerializable {
  private readonly $registrationTime: Date;

  private readonly $completionTime: Date;

  private readonly $trackingId: TrackingId;

  private readonly $voyageNumber: VoyageNumber;

  private readonly $type: HandlingEventType;

  private readonly $unLocode: UnLocode;

  constructor(
    registrationTime: Date,
    completionTime: Date,
    trackingId: TrackingId,
    voyageNumber: VoyageNumber,
    type: HandlingEventType,
    unLocode: UnLocode,
  ) {
    this.$registrationTime = registrationTime;
    this.$completionTime = completionTime;
    this.$trackingId = trackingId;
    this.$voyageNumber = voyageNumber;
    this.$type = type;
    this.$unLocode = unLocode;
  }

  get completionTime() {
    return this.$completionTime;
  }

  get trackingId() {
    return this.$trackingId;
  }

  get voyageNumber() {
    return this.$voyageNumber;
  }

  get type() {
    return this.$type;
  }

  get unLocode() {
    return this.$unLocode;
  }

  get registrationTime() {
    return this.$registrationTime;
  }

  toString() {
    return `registrationTime: ${this.$registrationTime}
    completionTime: ${this.$completionTime}
    trackingId: ${this.$trackingId}
    voyageNumber: ${this.$voyageNumber}
    type: ${this.$type}
    unLocode: ${this.$unLocode}`;
  }
}
