import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ScalableWebsocketModule } from '../scalable-websocket/scalable-websocket.module';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [ScalableWebsocketModule, AuthModule],
  providers: [EventsGateway],
})
export class EventsModule {}
