import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { SubEventsModule } from './modules/sub-events/sub-events.module';
import { EventsModule } from './modules/events/events.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { AuthModule } from './auth/auth.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { StandardDistancesModule } from './module-enums/standard-distances/standard-distances.module';
import { MeModule } from './me/me.module';
import { ConfigModule } from '@nestjs/config';
import { VisitorsModule } from './modules/visitors/visitors.module';
import { AuthorizationModule } from './authorization/authorization.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true
    }),
    UsersModule,
    SubEventsModule,
    EventsModule,
    OrganizationsModule,
    AuthModule,
    DrizzleModule,
    StandardDistancesModule,
    MeModule,
    AuthorizationModule,
    VisitorsModule,
    AuthorizationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
