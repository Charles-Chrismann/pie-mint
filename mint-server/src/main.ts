import 'dotenv/config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import logger from './logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));
  app.use(compression())
  app.enableCors()
  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('Mint Api')
    .setDescription('The mint API')
    .setVersion('1.0')
    .addTag('SubEvents')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token'
    )
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    }
  });

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`🚀 App running on: ${await app.getUrl()} 🚀`)
}
bootstrap();
