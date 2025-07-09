import { ForbiddenException, Injectable } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { events_table, registrations_table, sub_events_table, track_points_table, track_segments_table, tracks_table, user_profiles_table } from 'src/db/schema';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { SubEvent } from './entities/sub-event.entity';
import { AddRunnerToSubEventDto, CreateSubEventDto, GetSubEventsAroundQueryDto, UpdateSubEventDto } from './dto/sub-event.dto';
import { JWTUser } from 'src/declaration';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { chunkify, getPointsFromGpx, getSubEventTrack } from 'src/utils';
import { XMLParser } from 'fast-xml-parser';
import { alias } from 'drizzle-orm/pg-core';

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

  async createSubEvent(user: JWTUser, createSubEventDto: CreateSubEventDto, file: Express.Multer.File) {

    // TODO: Check authorizations

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
            location: sql`ST_SetSRID(ST_MakePoint(${p.lng}, ${p.lat}, ${p.alt}), 4326)`,
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
        start_date: new Date(createSubEventDto.start_date),
        positive_elevation: createSubEventDto.positive_elevation,
        standard_distance_id: createSubEventDto.standard_distance_id,
        track_id: createdTrack.id
      })
      .returning()
    )[0]

    return createdSubEvent

    // return (await this.drizzle.client.insert(sub_events_table).values(createSubEventDto).returning())[0]
  }

  async updateSubEvent(subEventId: number, user: JWTUser, updateSubEventDto: UpdateSubEventDto) {
    console.log(subEventId)
    console.log(user)
    console.log(updateSubEventDto)

    // const setObj: Record<string, any> = {}
    // for(const [key, value] of Object.entries(updateSubEventDto)) {
    //   setObj[key] = value
    // }

    // console.log(setObj)

    return (
      await this.drizzle.client
        .update(sub_events_table)
        .set(updateSubEventDto)
        .where(
          eq(sub_events_table.id, subEventId)
        )
        .returning()
    )[0]
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

  async getSubEventRunners(
    subEventId: number
  ) {
    const registration = alias(registrations_table, "registration")
    const user_profile = alias(user_profiles_table, "user_profile")
    return this.drizzle.client
      .select()
      .from(registration)
      .innerJoin(user_profile, eq(user_profile.id, registration.user_profile_id))
      .where(eq(registration.sub_event_id, subEventId))
  }

  async getSubEventsAround(
    query: GetSubEventsAroundQueryDto
  ) {

    const point = {
      y: query.coordinates[0],
      x: query.coordinates[1],
    };

    const sqlPoint = sql`ST_SetSRID(ST_MakePoint(${point.x}, ${point.y}), 4326)`;

    // const results = await this.drizzle.client
    //   .select()
    //   .from(track_points_table)
    //   .where(sql`ST_DistanceSphere(${track_points_table.location}, ${sqlPoint}) <= ${query.radius}`)


    const results = await this.drizzle.client
      .selectDistinctOn([sub_events_table.id])
      .from(sub_events_table)
      .innerJoin(tracks_table, eq(tracks_table.id, sub_events_table.track_id))
      .innerJoin(track_points_table, eq(track_points_table.track_id, tracks_table.id))
      .where(
        !query.startsOnly ?
          sql`ST_DistanceSphere(${track_points_table.location}, ${sqlPoint}) <= ${query.radius}`
          :
          and(
            sql`ST_DistanceSphere(${track_points_table.location}, ${sqlPoint}) <= ${query.radius}`,
            eq(track_points_table.is_first_point, true)
          )
      );

    console.log(results.length)
    return results

    // return this.drizzle.client
    //   .select()
    //   .from(sub_events_table)
    //   .innerJoin(
    //     tracks_table
    //   )
  }
}
