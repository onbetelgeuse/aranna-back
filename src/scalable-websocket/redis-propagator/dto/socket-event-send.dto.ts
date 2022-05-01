import { RedisSocketEventEmitDto } from './socket-event-emit.dto';

export class RedisSocketEventSendDto extends RedisSocketEventEmitDto {
  public readonly userId: string;
  public readonly socketId: string;
}
