import "dotenv/config"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { decodePositionBuffer, decodeRacePositionsBuffer, encodePositionBuffer, encodeRacePositionsBuffer } from "./classes/utils";
import Redis from "./Redis";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
  app.use(bodyParser.json({ limit: '100mb' }));
  await app.listen(process.env.PORT ?? 3001);

  // const buff = encodeRacePositionsBuffer([
  //   { lat: 47.206448, lon: -1.565203, alt: 131.344 },
  //   { lat: 47.206448, lon: -1.565203, alt: 131.344 },
  //   { lat: 47.206448, lon: -1.565203, alt: 131.344 },
  //   { lat: 47.206448, lon: -1.565203, alt: 131.344 },
  // ])
  // console.log(decodeRacePositionsBuffer(buff))
  // await Redis.set('a', buff)
  // const a = await Redis.getBuffer('a')
  // console.log(typeof a);
  // console.log(decodePositionBuffer(a!));

  console.log(`App running on ${await app.getUrl()}`)
}
bootstrap();
