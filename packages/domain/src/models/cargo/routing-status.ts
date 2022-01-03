/**
 * Routing status.
 */

import { Enum, EnumType } from 'ts-jenum';

@Enum('type')
export class RoutingStatus extends EnumType<RoutingStatus>() {
  static readonly NOT_ROUTED = new RoutingStatus(1);
  static readonly ROUTED = new RoutingStatus(2);
  static readonly MISROUTED = new RoutingStatus(3);

  readonly type: number;

  private constructor(type: number) {
    super();
    this.type = type;
  }

  sameValueAs(other: RoutingStatus): boolean {
    return other && this.type === other.type;
  }

  equals(other: RoutingStatus): boolean {
    return other && this.type === other.type;
  }
}
