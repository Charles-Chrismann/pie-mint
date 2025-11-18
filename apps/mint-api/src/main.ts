import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import logger from './logger';
import helmet from 'helmet';

const PORT = process.env.PORT ?? 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));
  app.use(compression())
  app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        upgradeInsecureRequests: null,
      },
    },
  })
);
  app.enableCors()
  app.setGlobalPrefix('api')

  const configBuilder = new DocumentBuilder()
    .setTitle('Mint Api')
    .setDescription('The mint API')
    .setVersion('1.0')
    .addTag('Races')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token'
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'refresh-token'
    );

  const apiUrl = process.env.NODE_ENV === 'development'
    ? `http://localhost:${PORT}`
    : `${process.env.SELF_HOST}`;

  configBuilder.addServer(apiUrl);

  const config = configBuilder.build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    }
  });

  await app.listen(PORT);
  logger.log(`🚀 App running on: ${await app.getUrl()} 🚀`)
}
bootstrap();