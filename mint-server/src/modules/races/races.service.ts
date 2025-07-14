import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { events_table, registrations_table, races_table, track_segments_table, tracks_table, user_profiles_table } from 'src/db/schema';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import {
  AddRunnerToRaceDto,
  CreateRaceDto,
  GetRacesAroundQueryDto,
  UpdateRaceDto
} from './dto/race.dto';
import { JWTUser } from 'src/declaration';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { chunkify, getPointsFromGpx } from 'src/utils';
import { XMLParser } from 'fast-xml-parser';
import { alias } from 'drizzle-orm/pg-core';

@Injectable()
export class RacesService {
  constructor(
    private drizzle: DrizzleService,
    private authorization: AuthorizationService
  ) { }

  async getAllRaces(): Promise<any> {
    const races = await this.drizzle.client.select().from(races_table)
    return races
  }

  async getRaceById(raceId: number) {
    return (await this.drizzle.client.select().from(races_table).where(eq(races_table.id, raceId)).limit(1))[0]
  }

  async createRace(user: JWTUser, createRaceDto: CreateRaceDto, file: Express.Multer.File) {

    // // TODO: Check authorizations

    // const createdTrack = (await this.drizzle.client
    //   .insert(tracks_table)
    //   .values({
    //     name: file.filename
    //   })
    //   .returning())[0]

    // const fileAsString = file.buffer.toString()
    // const parser = new XMLParser({ ignoreAttributes: false })
    // const gpxData = parser.parse(fileAsString)
    // const points = getPointsFromGpx(gpxData)

    // const chunks = chunkify(points, 512)

    // const createdPoints = (await Promise.all(
    //   chunks.map((chunk, chunkI) =>
    //     this.drizzle.client.insert(track_points_table).values(
    //       chunk.map((p, i) => ({
    //         location: sql`ST_SetSRID(ST_MakePoint(${p.lng}, ${p.lat}, ${p.alt}), 4326)`,
    //         is_first_point: i === 0 && chunkI === 0,
    //         is_last_point: i === chunk.length - 1 && chunkI === chunks.length - 1,
    //         track_id: createdTrack.id,
    //       }))
    //     ).returning()
    //   )
    // ))

    // const createdSegments = await Promise.all(
    //   createdPoints.map((chunk, chunkI) => this.drizzle.client.insert(track_segments_table).values(
    //     chunk.map((point, pointI) => {
    //       let end_position_id: undefined | number
    //       // si c'est le dernier point du dernier chunk
    //       if (chunkI === createdPoints.length - 1 && pointI === chunk.length - 1) end_position_id = undefined
    //       else {
    //         // Si y a un point derrière
    //         if (pointI !== chunk.length - 1) end_position_id = chunk[pointI + 1].id
    //         else end_position_id = createdPoints[chunkI + 1][0].id
    //       }
    //       return ({
    //         track_id: point.track_id,
    //         start_position_id: point.id,
    //         end_position_id
    //       })
    //     })).returning())
    // )

    // const createdRace = (await this.drizzle.client
    //   .insert(races_table)
    //   .values({
    //     event_id: createRaceDto.event_id,
    //     name: createRaceDto.name,
    //     distance: createRaceDto.distance,
    //     start_date: new Date(createRaceDto.start_date),
    //     positive_elevation: createRaceDto.positive_elevation,
    //     standard_distance_id: createRaceDto.standard_distance_id,
    //     track_id: createdTrack.id
    //   })
    //   .returning()
    // )[0]

    // return createdRace
    console.log(createRaceDto.start_date)

    const values: any = {...createRaceDto}

    if(!createRaceDto.event_id && !createRaceDto.organization_id) {
      values.created_by_id = user.userId
      values.owner_id = user.userId
    } else if (!(createRaceDto.event_id && createRaceDto.organization_id)) throw new BadRequestException()

    return (await this.drizzle.client.insert(races_table).values(values).returning())[0]
  }

  async updateRace(raceId: number, user: JWTUser, updateRaceDto: UpdateRaceDto) {
    console.log(raceId)
    console.log(user)
    console.log(updateRaceDto)

    // const setObj: Record<string, any> = {}
    // for(const [key, value] of Object.entries(updateRaceDto)) {
    //   setObj[key] = value
    // }

    // console.log(setObj)

    return (
      await this.drizzle.client
        .update(races_table)
        .set(updateRaceDto)
        .where(
          eq(races_table.id, raceId)
        )
        .returning()
    )[0]
  }

  async addRunnerToRace(
    userId: JWTUser['userId'],
    raceId: number,
    addRunnerToRaceDto: AddRunnerToRaceDto[]
  ) {
    if (!await this.authorization.canAddRunnerToRace(userId, raceId))
      throw new ForbiddenException('You are not allowed to add a runner in this event.');

    const createdRegistrations = await this.drizzle.client
      .insert(registrations_table)
      .values(addRunnerToRaceDto.map(i => ({
        is_accepted: false,
        is_private: i.is_private,
        bib_number: i.bib_number,
        bib_alias: i.bib_alias,
        user_profile_id: i.user_profile_id,
        sub_event_id: raceId,
        sub_event_start_wave_id: i.sub_event_start_wave_id,
      })))
      .returning()

    return createdRegistrations
  }

  async getRaceRunners(
    raceId: number
  ) {
    const registration = alias(registrations_table, "registration")
    const user_profile = alias(user_profiles_table, "user_profile")
    return this.drizzle.client
      .select()
      .from(registration)
      .innerJoin(user_profile, eq(user_profile.id, registration.user_profile_id))
      .where(eq(registration.sub_event_id, raceId))
  }

  async getRacesAround(
    query: GetRacesAroundQueryDto
  ) {

    //   const point = {
    //     y: query.coordinates[0],
    //     x: query.coordinates[1],
    //   };

    //   const sqlPoint = sql`ST_SetSRID(ST_MakePoint(${point.x}, ${point.y}), 4326)`;

    //   // const results = await this.drizzle.client
    //   //   .select()
    //   //   .from(track_points_table)
    //   //   .where(sql`ST_DistanceSphere(${track_points_table.location}, ${sqlPoint}) <= ${query.radius}`)


    //   const results = await this.drizzle.client
    //     .selectDistinctOn([races_table.id])
    //     .from(races_table)
    //     .innerJoin(tracks_table, eq(tracks_table.id, races_table.track_id))
    //     .innerJoin(track_points_table, eq(track_points_table.track_id, tracks_table.id))
    //     .where(
    //       !query.startsOnly ?
    //         sql`ST_DistanceSphere(${track_points_table.location}, ${sqlPoint}) <= ${query.radius}`
    //         :
    //         and(
    //           sql`ST_DistanceSphere(${track_points_table.location}, ${sqlPoint}) <= ${query.radius}`,
    //           eq(track_points_table.is_first_point, true)
    //         )
    //     );

    //   console.log(results.length)
    //   return results

    //   // return this.drizzle.client
    //   //   .select()
    //   //   .from(races_table)
    //   //   .innerJoin(
    //   //     tracks_table
    //   //   )
  }

  async getRaceTrack(trackId: number) {
    const results = (await this.drizzle.client // TODO: adapter pour le multi segment 
      .select({
        id: track_segments_table.id,
        track_id: track_segments_table.track_id,
        segment_index: track_segments_table.segment_index,
        segment: sql<string>`ST_AsGeoJSON(${track_segments_table.segment})`,
      })
      .from(track_segments_table)
      .where(eq(track_segments_table.id, trackId))
      .limit(1)
    )[0]

    return JSON.parse(results.segment)
  }
  // return results.map(r => ({...r, segment: JSON.parse(r.segment)}))

  // const result = await this.drizzle.client.execute(
  //   sql`
  //   SELECT ST_AsGeoJSON(ST_LineMerge(ST_Union(${track_segments_table.segment}))) AS merged_segment
  //   FROM ${track_segments_table}
  //   WHERE ${track_segments_table.track_id} = ${trackId}
  // `
  // ) as any

  //     const result = await this.drizzle.client.execute(
  //       sql`
  //   SELECT
  //     ST_AsGeoJSON(ST_LineMerge(ST_Union(${track_segments_table.segment}))) AS merged_segment,
  //     GeometryType(ST_LineMerge(ST_Union(${track_segments_table.segment}))) AS geom_type
  //   FROM ${track_segments_table}
  //   WHERE ${track_segments_table.track_id} = ${trackId}
  // `
  //     ) as any

  // return JSON.parse(result.rows[0].merged_segment);
}
