import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { events_table, organizations_table, sub_events_table } from 'src/db/schema';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { CreateEventDto } from './dto/event.dto';
import { DBOrganization, JWTUser } from 'src/declaration';

@Injectable()
export class EventsService {

  constructor(private drizzle: DrizzleService) { }

  async getEventById(eventId: number) {
    return (await this.drizzle.client
      .select()
      .from(events_table)
      .where(
        and(
          eq(events_table.id, eventId),
          eq(events_table.is_auto_generated, false)
        )
      )
      .limit(1)
    )[0]
  }

  getEventSubEvents(eventId: number) {
    return this.drizzle.client
      .select()
      .from(sub_events_table)
      .where(
        eq(sub_events_table.event_id, eventId)
      )
  }

  async isAllowedToCreateEvent(userId: number, organization: DBOrganization) {

    if(organization.owner_id === userId) return true

    // TODO: add logic for groups and permissions

    return false
  }

  async createEvent(user: JWTUser, createEventDto: CreateEventDto) {
    const organization  = (await this.drizzle.client
      .select()
      .from(organizations_table)
      .where(eq(organizations_table.id, createEventDto.organization_id))
      .limit(1)
    )[0] as DBOrganization | undefined

    if(!organization) throw new NotFoundException()

    if (
      !(await this.isAllowedToCreateEvent(user.userId, organization))
    ) throw new ForbiddenException('You are not allowed to create an event in this organization.');

    const createdEvent = (await this.drizzle.client
      .insert(events_table)
      .values({
        name: createEventDto.name,
        description: createEventDto.description,
        start_date: new Date(createEventDto.start_date),
        end_date: new Date(createEventDto.end_date),
        organization_id: organization.id,
      })
      .returning()
    )[0]

    return createdEvent
  }
}
