import { NestFactory } from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common';
import { AppModule } from './app.module';
import 'dotenv/config';

// initialization dyal application
// NestJS kaygeneri lik had pattern automatiquement

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(4000);
}

bootstrap();