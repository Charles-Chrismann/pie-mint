import "dotenv/config"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { Logger } from "./logger/logger.service";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RedisIoAdapter } from './redis-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
  app.use(bodyParser.json({ limit: '100mb' }));
  app.useLogger(app.get(Logger))
  app.useWebSocketAdapter(new RedisIoAdapter(app));

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, documentFactory);

  await app.listen(process.env.PORT ?? 3001);

  console.log(`App running on ${await app.getUrl()}`)
}
bootstrap();
