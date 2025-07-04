import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import {
  registrations_table,
  user_profiles_table,
  visitors_table,
} from 'src/db/schema';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Injectable()
export class VisitorsService {
  constructor(private drizzle: DrizzleService) {}

  async getVisitorTracks(visitor_code: string) {
    return await this.drizzle.client
      .select({
        registrationsBibAlias: registrations_table.bib_alias,
        registrationsBibNumber: registrations_table.bib_number,
        registrationsId: registrations_table.user_profile_id,
        registrationSubEventId: registrations_table.sub_event_id,
        registrationSubEventStartWaveId:
          registrations_table.sub_event_start_wave_id,
      })
      .from(registrations_table)
      .innerJoin(
        user_profiles_table,
        eq(registrations_table.user_profile_id, user_profiles_table.user_id),
      )
      .innerJoin(
        visitors_table,
        eq(visitors_table.user_profiles_id, user_profiles_table.user_id),
      )
      .where(
        and(
          eq(visitors_table.code, visitor_code),
          eq(registrations_table.is_private, false),
        ),
      );
  }
}
