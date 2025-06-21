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

  async getSubEventTrack(subEventId: number) {
    const track = (await this.drizzle.client
    .select()
    .from(tracks_table)
    .where(eq(tracks_table.id, subEventId)).limit(1))[0]

    const points = await this.drizzle.client
    .select()
    .from(track_points_table)
    .where(eq(track_points_table.track_id, track.id))

    const segments = await this.drizzle.client
    .select()
    .from(track_segments_table)
    .where(eq(track_segments_table.track_id, track.id))

    // return {
    //   track,
    //   points,
    //   segments
    // }

    const pointsToReturn: typeof points = []
    const firstPoint = points.find(p => p.is_first_point)!
    // firstPoint[0] = true
    pointsToReturn.push(firstPoint)

    let nextPointId = segments.find(s => s.start_position_id === firstPoint!.id)!.id
    let nextPoint = points.find(p => p.id === nextPointId)

    while(nextPoint) {
      pointsToReturn.push(nextPoint)

      const nextSegment = segments.find(s => s.start_position_id === nextPoint!.id)
      if(!nextSegment) break;
      let nextPointId = nextSegment.end_position_id
      nextPoint = points.find(p => p.id === nextPointId)
    }

    return pointsToReturn
  }

  async createSubEvent(createSubEventDto: CreateSubEventDto) {
    return (await this.drizzle.client.insert(sub_events_table).values(createSubEventDto).returning())[0]
  }
}
