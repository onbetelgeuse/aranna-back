import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validate } from './env.validation';
import databaseConfig from './config/database.config';
import securirtyPasswordConfig from './config/securirty-password.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ScalableWebsocketModule } from './scalable-websocket/scalable-websocket.module';
import { EventsModule } from './events/events.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import redisConfig from './config/redis.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import keycloakConfig from './config/keycloak.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        databaseConfig,
        securirtyPasswordConfig,
        redisConfig,
        keycloakConfig,
      ],
      validate,
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: config.get('database.host'),
        port: config.get('database.port'),
        username: config.get('database.username'),
        password: config.get('database.password'),
        database: config.get('database.name'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get('database.synchronize'),
        logger: 'advanced-console',
        logging: ['info', 'warn', 'log', 'query', 'error', 'schema'],
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CommonModule,
    ScalableWebsocketModule,
    EventsModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('redis.host'),
          port: config.get('redis.port'),
          role: config.get('redis.role'),
          password: config.get('redis.password'),
        },
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    ClientsModule.registerAsync([
      {
        name: 'MAILER_SERVICE',
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              {
                hostname: config.get('RABBITMQ_HOST'),
                port: config.get('RABBITMQ_PORT'),
                username: config.get('RABBITMQ_USER'),
                password: config.get('RABBITMQ_PASS'),
              },
            ],
            queue: config.get('RABBITMQ_QUEUE_NAME'),
            queueOptions: { durable: false },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
