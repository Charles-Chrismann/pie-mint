import { HttpException, Injectable, NotFoundException, OnModuleInit, StreamableFile } from '@nestjs/common';
import Redis from './Redis';
import { createGPXString, decodePosition, encodePosition, getPointsFromGpx } from './seed/utils';
import * as fs from 'fs/promises'
import { Readable } from 'stream';
import { PositionPayload, Race } from './declarations';
import { EmulatedRace } from './classes/EmulatedRace';
import { length, lineString, nearestPointOnLine, point } from '@turf/turf';
import type { Point, Feature, GeoJsonProperties, LineString } from 'geojson';
import { RegisterRaceDTO } from './dto/race.dto';
import { XMLParser } from 'fast-xml-parser';
import { getPointsTotalDistance, gpxPointsToEquidistantPoints } from './classes/utils';
import { ConfigService } from '@nestjs/config';
import { simplifyGpx } from './utils';

@Injectable()
export class AppService{

  emulatedRace: EmulatedRace[] = []
  lastSecondEvents: any[] = []
  racesMap = new Map<string, {
    race: Race,
    runnerIds: Set<string>,
    line: Feature<LineString, GeoJsonProperties>
  }>()

  constructor(
    private config: ConfigService
  ) {}

  async registerRace(body: RegisterRaceDTO) {

    const xmlParser = new XMLParser({ ignoreAttributes: false })
    const gpxData = xmlParser.parse(body.gpx)
    const points = getPointsFromGpx(gpxData)

    this.racesMap.set(body.id, {
      race: body,
      runnerIds: new Set(body.runnerIds),
      line: lineString(points.map(({ lat, lon }) => [lon, lat])),
    })
    return Redis.registerRace(body)
  }

  exportRaceGPXs() {
    
  }

  async exportRaceUserGPX(userId: string, raceId: string) {
    console.log(await Redis.keys('*'))
    const start = performance.now()
    const positions = (await Redis.zrangeBuffer(`user:${userId}:race:${raceId}:positions`, 0, -1)).map(p => decodePosition(p))
    console.log(performance.now() - start)
    console.log(positions)

    const stream = Readable.from([createGPXString(positions)]);
    return new StreamableFile(stream);
  }

  async getRunningRaces() {
    const ids = await Redis.smembers("races");
    const races = (await Redis.mget(ids.map(id => `race:${id}`))).filter((r): r is string => r !== null).map(r => JSON.parse(r)) as Race[]

    const runningRaces = races.filter((r: Race) => {
      const now = new Date()
      const start = new Date(r.startDate)
      const end = new Date(r.endDate)

      if(start <= now && end > now) return true

      return false
    })

    if(!runningRaces) return []

    const pipeline = Redis.pipeline()
    for(const race of runningRaces) {
      pipeline.smembers(`race:${race.id}:users`)
    }
    const runners = await pipeline.exec()
    if(!runners) throw new NotFoundException()

    runners.forEach((r, i) => {
      if(r[0]) {
        console.error(r[0])
        return
      }

      runningRaces[i].runnerIds = r[1] as string[]
    })

    return runningRaces
  }

  getEmulatingRaces() {
    return this.emulatedRace.map(er => ({
      id: er.id,
      startDate: er.startDate,
      endDate: er.endDate,
      runnerIds: er.runners.map(r => r.runnerId)
    }))
  }

  async emulate({ runnerCount }: { runnerCount: string }) {
    const id = crypto.randomUUID()
    const startDate = new Date(Date.now() + 10000)
    const endDate = new Date(startDate.getTime() + 6 * 60 * 60 * 1000)
    const runnerIds = Array.from({ length: +runnerCount }).map(_ => crypto.randomUUID())
    const gpx = simplifyGpx((await fs.readFile('./public/gpxs/nantes_marathon.gpx')).toString())

    const race = {
      id,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      gpx,
      runnerIds,
    }
    
    await this.registerRace(race)
    this.emulatedRace.push(new EmulatedRace(
      id,
      startDate,
      endDate,
      gpx,
      runnerIds
    ))

    return {
      ...race,
      gpx: undefined,
      api: {
        ranking: `http://localhost:${this.config.getOrThrow('PORT')}/race/${id}/ranking`
      }
    }
  }

  async handlePositionEvent(userId: string, data: PositionPayload) {
    const raceId = data.raceId

    // const raceRes = await Redis.get(`race:${raceId}`);
    // if(!raceRes) return
    // const race: Race = JSON.parse(raceRes)
    // console.log(raceId, race)

    
    // const isMember = await Redis.sismember(`race:${raceId}:users`, userId);
    // if(!isMember) return
    
    const cache = this.racesMap.get(raceId)
    if(!cache) return

    const { race, runnerIds, line } = cache
    
    const startDate = new Date(race.startDate)
    const endDate = new Date(race.endDate)
    const currentDate = new Date()
    if(currentDate < startDate || currentDate >= endDate) return

    if(!runnerIds.has(userId)) return
    
    const timestamp = Date.now()
    const { lon, lat } = data.position
    const p = point([lon, lat]);
    const snapped = nearestPointOnLine(line, p, { units: 'meters' });
    const progress = snapped.properties.location;

    Redis.storePositionAndProgress(raceId, userId, { timestamp, ...data.position }, progress)

    // update classement

    this.lastSecondEvents.push({
      userId,
      lon: data.position.lon,
      lat: data.position.lat,
      alt: data.position.alt,
    })
  }

  async getRaceRanking(raceId: string) {
    const raw = await Redis.zrevrange(`race:${raceId}:ranking`, 0, -1, 'WITHSCORES')
    const ranking: { rank: number, runnerId: string, progress: number}[] = [];
    for (let i = 0; i < raw.length; i += 2) {
      ranking.push({
        rank: i / 2 + 1,
        runnerId: raw[i],
        progress: parseFloat(raw[i + 1])
      });
    }

    return ranking
  }
}
