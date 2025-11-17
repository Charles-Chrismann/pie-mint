import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { db } from '@repo/db';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // console.log(await db.select().from(usersTable))
  await app.listen(process.env.PORT ?? 3000);







}
bootstrap();
