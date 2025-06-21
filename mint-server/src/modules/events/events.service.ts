import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { events_table, sub_events_table } from 'src/db/schema';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Injectable()
export class EventsService {

  constructor(private drizzle: DrizzleService){}

  getEventById(eventId: number) {
    return this.drizzle.client.select().from(events_table).where(eq(events_table.id, eventId ))
  }

  getEventSubEvents(eventId: number) {
    return this.drizzle.client.select().from(sub_events_table).where(eq(sub_events_table.event_id, eventId ))
  }
}
