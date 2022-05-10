import { INestApplicationContext, WebSocketAdapter } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import socketio from 'socket.io';
import { AuthService } from '../../auth/auth.service';
import { UserDto } from '../../auth/user/dto/user.dto';
import { RedisPropagatorService } from '../redis-propagator/redis-propagator.service';
import { SocketStateService } from './socket-state.service';

interface TokenPayload {
  readonly userId: string;
  readonly token?: string;
}

export interface AuthenticatedSocket extends socketio.Socket {
  auth?: TokenPayload;
}

export class SocketStateAdapter extends IoAdapter implements WebSocketAdapter {
  public constructor(
    private readonly app: INestApplicationContext,
    private readonly socketStateService: SocketStateService,
    private readonly redisPropagatorService: RedisPropagatorService,
    private readonly authService: AuthService,
  ) {
    super(app);
  }

  public create(port: number, options: any = {}) {
    const server = super.createIOServer({ port, ...options });
    this.redisPropagatorService.injectSocketServer(server);

    server.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const user: UserDto = await this.authService.validateAuthSocket(socket);
        socket.auth = {
          userId: String(user.id),
        };

        return next();
      } catch (e) {
        console.error(e);
        return next(e);
      }
    });

    return server;
  }

  public bindClientConnect(server: socketio.Server, callback: Function): void {
    server.on('connection', (socket: AuthenticatedSocket) => {
      if (socket.auth) {
        this.socketStateService.add(socket.auth.userId, socket);

        socket.on('disconnect', () => {
          this.socketStateService.remove(socket.auth.userId, socket);

          socket.removeAllListeners('disconnect');
        });
      }

      callback(socket);
    });
  }
}
