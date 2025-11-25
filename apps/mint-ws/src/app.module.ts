import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import Redis from './Redis';
import { envSchema } from './declarations';
import z from 'zod';
import { formatZodErrors } from './zod-helpers';
import { SignatureGuard } from './guards/signature.gaurds';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (config) => {
        const parsed = envSchema.safeParse(config);

        if (!parsed.success) {
          console.error(
            "❌ Invalid environment variables:\n" +
              formatZodErrors(parsed.error)
          );
          process.exit(1);
        }

        console.log(parsed.data)

        return parsed.data;
      },
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    AppGateway,
    SignatureGuard,
  ],
})
export class AppModule {}
