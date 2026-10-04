import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );
  // Admin web page (static files in backend/admin).
  app.useStaticAssets(path.resolve(process.cwd(), 'admin'), {
    prefix: '/admin',
  });
  const config = app.get(ConfigService);
  const port = Number(config.get<string>('PORT') ?? 8080);
  await app.listen(port);
}

void bootstrap();
