import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { events_table, track_points_table, track_segments_table, tracks_table } from 'src/db/schema';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Injectable()
export class SubEventsService {
  constructor(private drizzle: DrizzleService) {}

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

    return {
      track,
      points,
      segments
    }
  }
}
