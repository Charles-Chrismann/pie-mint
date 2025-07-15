import { Injectable } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { events_table, organizations_table, races_table, track_segments_table, tracks_table } from 'src/db/schema';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { CreateOrganizationDto } from './dto/organizations';
import { JWTUser } from 'src/declaration';

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
    const results = (await this.drizzle.client // TODO: adapter pour le multi segment 
      .select({
        tracks: tracks_table,
        races: races_table,
        track_segments: {
          ...track_segments_table,
          segment: sql<string>`ST_AsGeoJSON(${track_segments_table.segment})`,
        }
      })
      .from(organizations_table)
      .innerJoin(events_table, eq(events_table.organization_id, organizations_table.id))
      .innerJoin(races_table, eq(races_table.event_id, events_table.id))
      .innerJoin(tracks_table, eq(races_table.track_id, tracks_table.id))
      .innerJoin(track_segments_table, eq(track_segments_table.track_id, tracks_table.id))
      .where(
        eq(events_table.organization_id, organizationId)
      )
    )

    return results.map(r => ({
      tracks: r.tracks,
      races: r.races,
      track: { ...r.track_segments, segment: JSON.parse(r.track_segments.segment) }
    }))

    // const points = await Promise.all(results.map((r) => getRaceTrack(r.races.id)))

    // // console.log(points.map(a => a.length))

    // return results.map((r, i) => ({...r, track_points: points[i]}))
  }
}
