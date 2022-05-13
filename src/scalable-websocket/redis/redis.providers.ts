import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import {
  REDIS_PUBLISHER_CLIENT,
  REDIS_SUBSCRIBER_CLIENT,
} from './redis.constants';

export type RedisClient = Redis.Redis;

export const redisProviders: Provider[] = [
  {
    inject: [ConfigService],
    useFactory: (config: ConfigService): RedisClient => {
      return new Redis({
        host: config.get('redis.host'),
        port: config.get('redis.port'),
        role: config.get('redis.role'),
        password: config.get('redis.password'),
      });
    },
    provide: REDIS_SUBSCRIBER_CLIENT,
  },
  {
    inject: [ConfigService],
    useFactory: (config: ConfigService): RedisClient => {
      return new Redis({
        host: config.get('redis.host'),
        port: config.get('redis.port'),
        role: config.get('redis.role'),
        password: config.get('redis.password'),
      });
    },
    provide: REDIS_PUBLISHER_CLIENT,
  },
];
