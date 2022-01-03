import { Voyage } from '../voyage/voyage.model';
import { Cargo } from '../cargo';
import { Location } from '../location';
import { IDomainEvent } from '../../types/domain-event.interface';
import { Validate } from '../../helpers/validate.helper';
import { nullSafe } from '../../helpers/null-safe.helper';
import { StringBuilder } from '../../helpers/string.builder';
import { HashCodeBuilder } from '../../helpers/hash-code.builder';
import { HandlingEventType } from './handling-event.type';

/**
 * A HandlingEvent is used to register the event when, for instance,
 * a cargo is unloaded from a carrier at some location at a given time.
 * <p/>
 * The HandlingEvent's are sent from different Incident Logging Applications
 * some time after the event occurred and contain information about the
 * {@link TrackingId}, {@link Location}, timestamp of the completion of the event,
 * and possibly, if applicable a {@link Voyage}.
 * <p/>
 * This class is the only member, and consequently the root, of the HandlingEvent aggregate.
 * <p/>
 * HandlingEvent's could contain information about a {@link Voyage} and if so,
 * the event type must be either {@link Type#LOAD} or {@link Type#UNLOAD}.
 * <p/>
 * All other events must be of {@link Type#RECEIVE}, {@link Type#CLAIM} or {@link Type#CUSTOMS}.
 */
export class HandlingEvent implements IDomainEvent<HandlingEvent> {
  readonly #type: HandlingEventType;

  readonly #voyage: Voyage;

  readonly #location: Location;

  #completionTime: Date;

  #registrationTime: Date;

  readonly #cargo: Cargo;
  // #id: number;

  /**
   * Handling event type. Either requires or prohibits a carrier movement
   * association, it's never optional.
   */

  /**
   * @param cargo            cargo
   * @param completionTime   completion time, the reported time that the event
   * actually happened (e.g. the receive took place).
   * @param registrationTime registration time, the time the message is received
   * @param type             type of event
   * @param location         where the event took place
   * @param voyage           the voyage
   */
  constructor(
    cargo: Cargo,
    completionTime: Date,
    registrationTime: Date,
    type: HandlingEventType,
    location: Location,
    voyage?: Voyage,
  ) {
    Validate.notNil(cargo, 'Cargo is required');
    Validate.notNil(completionTime, 'Completion time is required');
    Validate.notNil(registrationTime, 'Registration time is required');
    Validate.notNil(type, 'Handling event type is required');
    Validate.notNil(location, 'Location is required');
    Validate.notNull(voyage, 'Voyage is required');

    if (voyage !== undefined && type.prohibitsVoyage()) {
      // TODO IllegalArgumentException
      throw new Error(`Voyage is not allowed with event type ${type}`);
    }

    this.#voyage = voyage;
    this.#completionTime = new Date(completionTime);
    this.#registrationTime = new Date(registrationTime);
    this.#type = type;
    this.#location = location;
    this.#cargo = cargo;
  }

  get type(): HandlingEventType {
    return this.#type;
  }

  get voyage(): Voyage {
    return nullSafe(this.#voyage, Voyage.NONE);
  }

  get completionTime(): Date {
    return new Date(this.#completionTime.getTime());
  }

  get registrationTime(): Date {
    return new Date(this.#registrationTime.getTime());
  }

  get location(): Location {
    return this.#location;
  }

  get cargo(): Cargo {
    return this.#cargo;
  }

  equals(event: object): boolean {
    if (this === event) return true;
    if (event == null || !(event instanceof HandlingEvent)) return false;

    return this.sameEventAs(event);
  }

  sameEventAs(other: HandlingEvent): boolean {
    if (!other) return false;
    const conditions = [
      this.#cargo.equals(other.#cargo),
      this.voyage.equals(other.voyage),
      this.location.equals(other.location),
      this.type.equals(other.type),
      this.completionTime.getTime() === other.completionTime.getTime(),
    ];
    return !conditions.some((c) => !c);
  }

  toString(): string {
    const builder = new StringBuilder('\n--- Handling event ---\n')
      .append('Cargo: ')
      .append(this.cargo.trackingId)
      .append('\n')
      .append('Type: ')
      .append(this.type)
      .append('\n')
      .append('Location: ')
      .append(this.location.name)
      .append('\n')
      .append('Completed on: ')
      .append(this.completionTime)
      .append('\n')
      .append('Registered on: ')
      .append(this.registrationTime)
      .append('\n');

    if (this.voyage != null) {
      builder.append('Voyage: ').append(this.voyage.voyageNumber).append('\n');
    }

    return builder.toString();
  }

  hashCode(): number {
    return new HashCodeBuilder()
      .append(this.cargo)
      .append(this.voyage)
      .append(this.completionTime)
      .append(this.location)
      .append(this.type)
      .toHashCode();
  }
}
