import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SubEventsModule } from './sub-events/sub-events.module';
import { EventsModule } from './events/events.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { AuthModule } from './auth/auth.module';
import { DrizzleModule } from './drizzle/drizzle.module';

@Module({
  imports: [UsersModule, SubEventsModule, EventsModule, OrganizationsModule, AuthModule, DrizzleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
