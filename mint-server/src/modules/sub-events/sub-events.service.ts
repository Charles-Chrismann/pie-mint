import { ForbiddenException, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { events_table, registrations_table, sub_events_table, track_points_table, track_segments_table, tracks_table, user_profiles_table } from 'src/db/schema';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { SubEvent } from './entities/sub-event.entity';
import { AddRunnerToSubEventDto, CreateSubEventDto } from './dto/sub-event.dto';
import { JWTUser } from 'src/declaration';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { chunkify, getPointsFromGpx, getSubEventTrack } from 'src/utils';
import { XMLParser } from 'fast-xml-parser';

@Injectable()
export class SubEventsService {
  constructor(
    private drizzle: DrizzleService,
    private authorization: AuthorizationService
  ) { }

  async getAllSubEvents(): Promise<any> {
    const subEvents = await this.drizzle.client.select().from(sub_events_table)
    return subEvents
  }

  async getSubEventById(subEventId: number) {
    return (await this.drizzle.client.select().from(sub_events_table).where(eq(sub_events_table.id, subEventId)).limit(1))[0]
  }

  async createSubEvent(createSubEventDto: CreateSubEventDto, file: Express.Multer.File) {

    const createdTrack = (await this.drizzle.client
      .insert(tracks_table)
      .values({
        name: file.filename
      })
      .returning())[0]

    const fileAsString = file.buffer.toString()
    const parser = new XMLParser({ ignoreAttributes: false })
    const gpxData = parser.parse(fileAsString)
    const points = getPointsFromGpx(gpxData)

    const chunks = chunkify(points, 512)

    const createdPoints = (await Promise.all(
      chunks.map((chunk, chunkI) =>
        this.drizzle.client.insert(track_points_table).values(
          chunk.map((p, i) => ({
            alt: p.alt,
            lat: p.lat,
            lng: p.lng,
            is_first_point: i === 0 && chunkI === 0,
            is_last_point: i === chunk.length - 1 && chunkI === chunks.length - 1,
            track_id: createdTrack.id,
          }))
        ).returning()
      )
    ))

    const createdSegments = await Promise.all(
      createdPoints.map((chunk, chunkI) => this.drizzle.client.insert(track_segments_table).values(
        chunk.map((point, pointI) => {
          let end_position_id: undefined | number
          // si c'est le dernier point du dernier chunk
          if (chunkI === createdPoints.length - 1 && pointI === chunk.length - 1) end_position_id = undefined
          else {
            // Si y a un point derrière
            if (pointI !== chunk.length - 1) end_position_id = chunk[pointI + 1].id
            else end_position_id = createdPoints[chunkI + 1][0].id
          }
          return ({
            track_id: point.track_id,
            start_position_id: point.id,
            end_position_id
          })
        })).returning())
    )

    const createdSubEvent = (await this.drizzle.client
      .insert(sub_events_table)
      .values({
        event_id: createSubEventDto.event_id,
        name: createSubEventDto.name,
        distance: createSubEventDto.distance,
        positiveElevation: createSubEventDto.positive_elevation,
        standard_distance_id: createSubEventDto.standard_distance_id,
        track_id: createdTrack.id
      })
      .returning()
    )[0]

    return createdSubEvent

    // return (await this.drizzle.client.insert(sub_events_table).values(createSubEventDto).returning())[0]
  }

  async addRunnerToSubEvent(
    userId: JWTUser['userId'],
    subEventId: number,
    addRunnerToSubEventDto: AddRunnerToSubEventDto[]
  ) {
    if (!await this.authorization.canAddRunnerToSubEvent(userId, subEventId))
      throw new ForbiddenException('You are not allowed to add a runner in this event.');

    const createdRegistrations = await this.drizzle.client
      .insert(registrations_table)
      .values(addRunnerToSubEventDto.map(i => ({
        is_accepted: false,
        is_private: i.is_private,
        bib_number: i.bib_number,
        bib_alias: i.bib_alias,
        user_profile_id: i.user_profile_id,
        sub_event_id: subEventId,
        sub_event_start_wave_id: i.sub_event_start_wave_id,
      })))
      .returning()

    return createdRegistrations
  }

  async getSubEventRunner(
    subEventId: number
  ) {
    return this.drizzle.client
      .select()
      .from(registrations_table)
      .innerJoin(user_profiles_table, eq(user_profiles_table.id, registrations_table.user_profile_id))
      .where(eq(registrations_table.sub_event_id, subEventId))
  }
}
