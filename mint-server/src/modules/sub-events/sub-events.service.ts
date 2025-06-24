import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { events_table, sub_events_table, track_points_table, track_segments_table, tracks_table } from 'src/db/schema';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { SubEvent } from './entities/sub-event.entity';
import { CreateSubEventDto } from './dto/sub-event.dto';

@Injectable()
export class SubEventsService {
  constructor(private drizzle: DrizzleService) {}

  async getAllSubEvents(): Promise<any> {
    const subEvents = await this.drizzle.client.select().from(sub_events_table)
    return subEvents
  }

  async getSubEventById(subEventId: number) {
    return (await this.drizzle.client.select().from(sub_events_table).where(eq(sub_events_table.id, subEventId)).limit(1))[0]
  }

  async createSubEvent(createSubEventDto: CreateSubEventDto) {
    return (await this.drizzle.client.insert(sub_events_table).values(createSubEventDto).returning())[0]
  }
}
