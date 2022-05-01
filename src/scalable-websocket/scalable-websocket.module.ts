import { Module } from '@nestjs/common';
import { RedisPropagatorModule } from './redis-propagator/redis-propagator.module';
import { RedisModule } from './redis/redis.module';
import { SocketStateModule } from './socket-state/socket-state.module';

@Module({
  imports: [RedisPropagatorModule, RedisModule, SocketStateModule],
  exports: [RedisPropagatorModule, RedisModule, SocketStateModule],
})
export class ScalableWebsocketModule {}
