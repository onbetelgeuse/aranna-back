import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject('MAILER_SERVICE') private readonly client: ClientRMQ) {}
  getHello(): string {
    return 'Hello World!';
  }

  getNodeEnv(): string {
    return process.env.NODE_ENV;
  }

  sendMail(data) {
    this.client.send({ cmd: 'send-mail' }, data).subscribe();
  }
}
