import "dotenv/config"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
  app.use(bodyParser.json({ limit: '100mb' }));
  
  await app.listen(process.env.PORT ?? 3001);
  console.log(`App running on ${await app.getUrl()}`)
}
bootstrap();
