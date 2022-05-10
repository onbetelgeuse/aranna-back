import { UseInterceptors } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { from, map, Observable } from 'rxjs';
import { Server } from 'socket.io';
import { Authorize } from '../auth/decorators/authorize.decorator';
import { RedisPropagatorInterceptor } from '../scalable-websocket/redis-propagator/redis-propagator.interceptor';

@UseInterceptors(RedisPropagatorInterceptor)
@WebSocketGateway()
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  public afterInit(server: Server) {
    server.listen(3000);
  }

  public handleConnection(client: any, ...args: any[]) {
    console.log(client);
  }

  handleDisconnect(client: any) {
    console.log(client);
  }

  @SubscribeMessage('events')
  handleMessage(client: any, payload: any): Observable<any> {
    return from([1, 2, 3]).pipe(
      map((item) => {
        return { event: 'events', data: item };
      }),
    );
  }
}
