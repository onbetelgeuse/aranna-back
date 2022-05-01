import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { SocketStateModule } from '../socket-state/socket-state.module';
import { RedisPropagatorService } from './redis-propagator.service';

@Module({
  imports: [RedisModule, SocketStateModule],
  providers: [RedisPropagatorService],
  exports: [RedisPropagatorService],
})
export class RedisPropagatorModule {}
