import { HttpException, Inject, Injectable, Logger, NotFoundException, OnModuleInit, StreamableFile } from '@nestjs/common';
import Redis from './Redis';
import { createGPXString, decodePosition, encodePosition, getPointsFromGpx } from './seed/utils';
import * as fs from 'fs/promises'
import { Readable } from 'stream';
import { PositionPayload, Race, RaceId, WsSendPositions } from './declarations';
import { EmulatedRace } from './classes/EmulatedRace';
import { length, lineString, nearestPointOnLine, point } from '@turf/turf';
import type { Point, Feature, GeoJsonProperties, LineString } from 'geojson';
import { RegisterRaceDTO } from './dto/race.dto';
import { XMLParser } from 'fast-xml-parser';
import { getPointsTotalDistance, gpxPointsToEquidistantPoints } from './classes/utils';
import { ConfigService } from '@nestjs/config';
import { simplifyGpx } from './utils';
import { Server } from 'socket.io';
import { AppGateway } from './app.gateway';

@Injectable()
export class AppService{
  public readonly logger = new Logger(AppService.name);

  public gatewayWsServer: AppGateway['server']

  emulatedRace: EmulatedRace[] = []
  lastSecondEvents: Map<RaceId, WsSendPositions> = new Map()
  emitTimeout: NodeJS.Timeout | null = null
  racesMap = new Map<string, {
    race: Race,
    runnerIds: Set<string>,
    line: Feature<LineString, GeoJsonProperties>
  }>()

  constructor(
    private config: ConfigService,
  ) {}


  
    async startEventSending() {
      this.logger.verbose(`Start emitting`)
      this.emitTimeout = setInterval(async () => {
  
        const emus = this.emulatedRace
        if(emus.length) {
          for(const race of emus) {
            const raceId = race.id
            race.progress++
            const positions = race.getPositions(race.progress)
            for(const position of positions) {
              this.handlePositionEvent(position.userId, { raceId, position: { lat: position.lat, lon: position.lon, alt: position.alt } })
            }
          }
        }
  
        // if(!this.lastSecondEvents.length) return

        const lastSecondEvents = Array.from(this.lastSecondEvents).map(([raceId, positions]) => ({ raceId, positions, ranking: [] as [string, number][] }))

        if(!lastSecondEvents.length) return

        const pipeline = Redis.pipeline()
        for(const entry of lastSecondEvents) {
          pipeline.zrevrange(`race:${entry.raceId}:ranking`, 0, -1, 'WITHSCORES')
        }

        const pipelineResults = await pipeline.exec()

        if(!pipelineResults) {
          this.logger.error(`No pipeline response`)
        } else if(!pipelineResults[0]) {
          this.logger.error(`Pipeline result empty`)
        } else if (pipelineResults[0][0]) {
          this.logger.error(`Ranking recuperation error: ${pipelineResults[0][0].message}`)
        } else {
          for(let j = 0; j < pipelineResults.length; j++) {
            const raw: string[] = pipelineResults[j][1] as string[]
            const ranking: [string, number][] = []
            for (let i = 0; i < raw.length; i += 2) {
              ranking.push([raw[i], +Number(raw[i + 1]).toFixed(4)])
            }
            lastSecondEvents[j].ranking = ranking
          }
        }

        for(const entry of lastSecondEvents) {
          // TODO: separate specs into rooms
          const { positions, ranking } = entry

          this.gatewayWsServer.to('specs')
          .emit('positions', { positions, ranking })
        }
  
      }, 1000)
    }

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

  async handlePositionEvent(userId: string | undefined, data: PositionPayload) {
    if(!userId) return

    const raceId = data.raceId
    
    const cache = this.racesMap.get(raceId)
    if(!cache) return

    const { race, runnerIds, line } = cache
    
    const startDate = new Date(race.startDate)
    const endDate = new Date(race.endDate)
    const currentDate = new Date()
    if(currentDate < startDate || currentDate >= endDate) return

    if(!runnerIds.has(userId)) return
    
    const timestamp = Date.now()
    const { lon, lat, alt } = data.position
    const cleanLon = lon
    const cleanLat = lat
    const cleanAlt = alt
    const p = point([lon, lat]);
    const snapped = nearestPointOnLine(line, p, { units: 'meters' });
    const progress = snapped.properties.location;

    Redis.storePositionAndProgress(raceId, userId, { timestamp, ...data.position }, progress)

    const lastSecondeRacePositions = this.lastSecondEvents.get(raceId)
    const entry: WsSendPositions[number] = [userId, cleanLon, cleanLat, cleanAlt]

    if(!lastSecondeRacePositions) {
      this.lastSecondEvents.set(raceId, [entry])
    } else {
      lastSecondeRacePositions.push(entry)
    }
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

  async getRaces() {
    const ids = await Redis.smembers("races");
    if(!ids.length) return []
    return (await Redis.mget(ids.map(id => `race:${id}`))).filter(str => !!str).map((str: string) => JSON.parse(str))
  }

  async getEndedRaces() {
    const ids = await Redis.smembers("races");
    if(!ids.length) return []
    const races: Race[] = (await Redis.mget(ids.map(id => `race:${id}`))).filter(str => !!str).map((str: string) => JSON.parse(str))
    const now = new Date()
    return races.filter(r => new Date(r.endDate) < now)
  }

  async pruneRace(raceId: RaceId) {
    if(this.emulatedRace.find(r => r.id === raceId)) this.emulatedRace = this.emulatedRace.filter(r => r.id !== raceId)
    this.racesMap.delete(raceId)
    await Redis.pruneRace(raceId)
  }
}
