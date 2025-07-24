import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { and, asc, eq, sql } from 'drizzle-orm';
import { events_table, registrations_table, races_table, track_segments_table, tracks_table, user_profiles_table, standard_distances_table, race_disciplines_table, race_discipline_categories_table, organizations_table, race_start_waves_table } from 'src/db/schema';
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
import { JoinedRace, JoinedStartWave, JoinedUser } from 'src/utils/drizzle.helpers';

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

    // const subquery = this.drizzle.client
    //   .select()
    //   .from(race_discipline_categories_table)
    //   .where(
    //     eq()
    //   )
    //   .as('userPets')

    const ownerAlias = alias(user_profiles_table, "owner")

    return (await this.drizzle.client
      .select({
        id: races_table.id,
        name: races_table.name,
        start_date: races_table.start_date,
        end_date: races_table.end_date,
        distance: races_table.distance,
        standard_distance: {
          id: standard_distances_table.id,
          name: standard_distances_table.name,
          distance: standard_distances_table.distance,
        },
        track: {
          id: tracks_table.id,
          name: tracks_table.name,
        },
        race_discipline: {
          id: race_disciplines_table.id,
          name: race_disciplines_table.name,
          race_discipline_category_id: race_disciplines_table.race_discipline_category_id,
          // category: {
          //   id: race_discipline_categories_table.id
          //   // as: race_discipline_categoriesAlias
          // }
        },
        event: {
          id: events_table.id,
          name: events_table.name,
          description: events_table.description,
          start_date: events_table.start_date,
          end_date: events_table.end_date,

          event_campaign_id: events_table.event_campaign_id,
          organization_id: events_table.organization_id,
        },
        organization: {
          id: organizations_table.id,
          name: organizations_table.name,
          media_avatar_id: organizations_table.media_avatar_id,
          media_banner_id: organizations_table.media_banner_id,
          created_by_id: organizations_table.created_by_id,
          owner_id: organizations_table.owner_id,
        },
        created_by: {
          id: user_profiles_table.id,
          firstname: user_profiles_table.firstname,
          lastname: user_profiles_table.lastname,
        },
        owner: {
          id: ownerAlias.id,
          firstname: ownerAlias.firstname,
          lastname: ownerAlias.lastname,
        }
      })
      .from(races_table)
      .leftJoin(standard_distances_table, eq(standard_distances_table.id, races_table.standard_distance_id))
      .leftJoin(tracks_table, eq(tracks_table.id, races_table.track_id))
      .leftJoin(race_disciplines_table, eq(race_disciplines_table.id, races_table.race_discipline_id))
      .leftJoin(race_discipline_categories_table, eq(race_discipline_categories_table.id, race_disciplines_table.race_discipline_category_id))
      .leftJoin(events_table, eq(events_table.id, races_table.event_id))
      .leftJoin(organizations_table, eq(organizations_table.id, races_table.organization_id))
      .leftJoin(user_profiles_table, eq(user_profiles_table.id, races_table.created_by_id))
      .leftJoin(ownerAlias, eq(ownerAlias.id, races_table.owner_id))
      .where(eq(races_table.id, raceId))
      .limit(1)
    )[0]
  }

  async createRace(contentType: string, user: JWTUser, createRaceDto: CreateRaceDto, file: Express.Multer.File) {

    // // TODO: Check authorizations

    console.log(contentType)

    console.log(createRaceDto)

    const values: any = { ...createRaceDto }

    if (!createRaceDto.event_id && !createRaceDto.organization_id) {
      values.created_by_id = user.userId
      values.owner_id = user.userId
    } else if (!(createRaceDto.event_id && createRaceDto.organization_id)) throw new BadRequestException()


    const parser = new XMLParser({ ignoreAttributes: false })
    const gpxStr = file.buffer.toString()
    const gpxData = parser.parse(gpxStr)
    const points = getPointsFromGpx(gpxData)


    return await this.drizzle.client.transaction(async (tx) => {
      const createdTrack = (await tx.insert(tracks_table).values({ name: file.originalname }).returning())[0]

      const [createdRaceList, createdsegmentList] = await Promise.all([
        tx.insert(races_table).values({
          ...values,
          track_id: createdTrack.id
        }).returning(),
        tx.insert(track_segments_table).values({
          track_id: createdTrack.id,
          segment_index: 1,
          segment: `LINESTRINGZ(${points.map(p => `${Number(p.lng.toFixed(8))} ${Number(p.lat.toFixed(8))} ${Number(p.alt.toFixed(8))}`).join(',')})`,
        }).returning()
      ])
      const createdRace = createdRaceList[0]
      const createdsegment = createdsegmentList[0]

      return createdRace
    });
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
        race_id: raceId,
        race_start_wave_id: i.race_start_wave_id,
      })))
      .returning()

    return createdRegistrations
  }

  async getRaceRunners(
    raceId: number
  ) {
    return this.drizzle.client
      .select({
        id: registrations_table.id,
        bib_number: registrations_table.bib_number,
        bib_alias: registrations_table.bib_alias,
        user_profile: JoinedUser,
        race: JoinedRace,
        start_wave: JoinedStartWave,
      })
      .from(registrations_table)
      .leftJoin(user_profiles_table, eq(user_profiles_table.id, registrations_table.user_profile_id))
      .leftJoin(races_table, eq(races_table.id, registrations_table.race_id))
      .leftJoin(race_start_waves_table, eq(race_start_waves_table.id, registrations_table.race_start_wave_id))
      .where(eq(registrations_table.race_id, raceId))
      .orderBy(asc(registrations_table.bib_number))
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

  async getRaceTrack(raceId: number) {
    const results = (await this.drizzle.client // TODO: adapter pour le multi segment 
      .select({
        id: track_segments_table.id,
        track_id: track_segments_table.track_id,
        segment_index: track_segments_table.segment_index,
        segment: sql<string>`ST_AsGeoJSON(${track_segments_table.segment})`,
      })
      .from(track_segments_table)
      .leftJoin(tracks_table, eq(tracks_table.id, track_segments_table.track_id))
      .leftJoin(races_table, eq(races_table.track_id, track_segments_table.track_id))
      .where(eq(races_table.id, raceId))
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
