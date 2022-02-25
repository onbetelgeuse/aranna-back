import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getNodeEnv(): string {
    return process.env.NODE_ENV;
  }
}
