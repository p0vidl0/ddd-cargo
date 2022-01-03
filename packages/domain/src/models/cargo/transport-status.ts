/**
 * Represents the different transport statuses for a cargo.
 */
import { Enum, EnumType } from 'ts-jenum';

@Enum('type')
export class TransportStatus extends EnumType<TransportStatus>() {
  static readonly NOT_RECEIVED = new TransportStatus(1);
  static readonly IN_PORT = new TransportStatus(2);
  static readonly ONBOARD_CARRIER = new TransportStatus(3);
  static readonly CLAIMED = new TransportStatus(4);
  static readonly UNKNOWN = new TransportStatus(5);

  readonly type: number;

  private constructor(type: number) {
    super();
    this.type = type;
  }

  sameValueAs(other: TransportStatus): boolean {
    return other && this.type === other.type;
  }

  equals(other: TransportStatus): boolean {
    return other && this.type === other.type;
  }
}
