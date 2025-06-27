import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { events_table, organizations_table, sub_events_table, tracks_table } from 'src/db/schema';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { CreateOrganizationDto } from './dto/organizations';
import { JWTUser } from 'src/declaration';
import { getSubEventTrack } from 'src/utils';

@Injectable()
export class OrganizationsService {
  constructor(private drizzle: DrizzleService) { }

  async createOrganization(
    user: JWTUser,
    createOrganizationDto: CreateOrganizationDto,
    files: {
      logo?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    }) {
    const createdOrganization = await this.drizzle.client.transaction(async (tx) => {
      const createdOrganization = (await tx
        .insert(organizations_table)
        .values({
          name: createOrganizationDto.name,
          created_by_id: user.userId,
          owner_id: user.userId,
        }).returning())[0]

      // TODO: prendre en charge les fichiers

      return createdOrganization
    })

    return createdOrganization
  }

  getAllOrganizanizations() {
    return this.drizzle.client.select().from(organizations_table)
  }

  async getOrganizanizationById(organizationId: number) {
    return (await this.drizzle.client.select().from(organizations_table).where(eq(organizations_table.id, organizationId)).limit(1))[0]
  }

  async getOrganizanizationEvents(organizationId: number) {
    return this.drizzle.client
    .select()
    .from(events_table)
    .where(
      and(
        eq(events_table.organization_id, organizationId),
        eq(events_table.is_auto_generated, false),
      )
    )
  }

  async getOrganizanizationTracks(organizationId: number) {
    const results = (await this.drizzle.client
    .select({
      tracks: tracks_table,
      sub_events: sub_events_table
    })
    .from(organizations_table)
    .innerJoin(events_table, eq(events_table.organization_id, organizations_table.id))
    .innerJoin(sub_events_table, eq(sub_events_table.event_id, events_table.id))
    .innerJoin(tracks_table, eq(sub_events_table.track_id, tracks_table.id))
    .where(eq(events_table.organization_id, organizationId)))

    const points = await Promise.all(results.map((r) => getSubEventTrack(r.sub_events.id)))

    // console.log(points.map(a => a.length))

    return results.map((r, i) => ({...r, track_points: points[i]}))
  }
}
