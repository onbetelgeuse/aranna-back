import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { initAdapters } from './adapters.init';
import { RmqOptions, Transport } from '@nestjs/microservices';

export const BASE_PATH = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get('PORT');
  initAdapters(app);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(BASE_PATH);
  app.use(helmet());
  app.enableCors();
  app.connectMicroservice<RmqOptions>({
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
    },
  });

  app.startAllMicroservices();
  await app.listen(port);
  const url = (await app.getUrl()).replace('[::1]', 'localhost');
  console.log(`Application is running on: ${url}`);
}
bootstrap();
