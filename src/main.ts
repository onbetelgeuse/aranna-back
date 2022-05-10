import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { initAdapters } from './adapters.init';

export const BASE_PATH = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  initAdapters(app);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(BASE_PATH);
  app.use(helmet());
  app.enableCors();

  await app.listen(port);
  const url = (await app.getUrl()).replace('[::1]', 'localhost');
  console.log(`Application is running on: ${url}`);
}
bootstrap();
