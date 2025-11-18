import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { events_table, organizations_table, races_table } from '@repo/db';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { CreateEventDto } from './dto/event.dto';
import { DBOrganization, JWTUser } from 'src/declaration';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {

  constructor(
    private drizzle: DrizzleService,
    private authorization: AuthorizationService
  ) { }

  async getEventById(eventId: number): Promise<Event> {
    return (await this.drizzle.client
      .select()
      .from(events_table)
      .where(
        eq(events_table.id, eventId)
      )
      .limit(1)
    )[0] as Event
  }

  getEventRaces(eventId: number) {
    return this.drizzle.client
      .select()
      .from(races_table)
      .where(
        eq(races_table.event_id, eventId)
      )
  }

  async createEvent(user: JWTUser, createEventDto: CreateEventDto) {

    if (
      !(await this.authorization.isAllowedToCreateEvent(user.userId, createEventDto.organization_id))
    ) throw new ForbiddenException('You are not allowed to create an event in this organization.');

    const createdEvent = (await this.drizzle.client
      .insert(events_table)
      .values({
        name: createEventDto.name,
        description: createEventDto.description,
        start_date: new Date(createEventDto.start_date),
        end_date: new Date(createEventDto.end_date),
        organization_id: createEventDto.organization_id,
      })
      .returning()
    )[0]

    return createdEvent
  }
}
