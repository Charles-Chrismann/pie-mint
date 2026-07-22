import { Injectable, NotFoundException } from '@nestjs/common';
import Redis from './Redis';
import { getPointsFromGpx } from './seed/utils';
import * as fs from 'fs/promises'
import { PositionPayload, Race, RaceId, RacesMapValues, RaceStats, ReplayJson, WsSendPositions } from './declarations';
import { EmulatedRace } from './classes/EmulatedRace';
import { length, lineString, nearestPointOnLine, point } from '@turf/turf';
import { CreateReplayDto, RegisterRaceDTO } from './dto/race.dto';
import { XMLParser } from 'fast-xml-parser';
import { decodePositionBuffer, decodeRacePositionsBuffer } from './classes/utils';
import { ConfigService } from '@nestjs/config';
import { simplifyGpx } from './utils';
import { AppGateway } from './app.gateway';
import { Logger } from './logger/logger.service';
import { Replay } from './classes/replay';

@Injectable()
export class AppService{

  public gatewayWsServer: AppGateway['server']

  emulatedRace: EmulatedRace[] = []
  replays = new Map<ReplayJson['id'], ReplayJson>
  lastSecondEvents: Map<RaceId, WsSendPositions> = new Map()
  emitTimeout: NodeJS.Timeout | null = null
  racesMap = new Map<string, RacesMapValues>()

  constructor(
    private config: ConfigService,
    public logger: Logger
  ) {}

  async restoreCache() {
    const raceIds: string[] = await Redis.smembers("races")
    const pipeline = Redis.pipeline()
    for(const raceId of raceIds) {
      pipeline.get(`race:${raceId}`)
      pipeline.getBuffer(`race:${raceId}:points`)
      pipeline.smembers(`race:${raceId}:users`)
      pipeline.zrange(`race:${raceId}:finishers`, 0, -1)
    }
    const res = await pipeline.exec()

    if(!res) throw new Error()

    for(let i = 0; i < res.length; i += 4) {
      const race: Race = JSON.parse(res[i][1] as string)
      const points = decodeRacePositionsBuffer(res[i + 1][1] as Buffer)
      const line = lineString(points.map(({ lon, lat }) => [lon, lat]))
      const totalDistanceInMeters = length(line, { units: "meters" })
      const runnerIds = new Set(res[i + 2][1] as string[])
      const finishedUserIds = new Set(res[i + 3][1] as string[])

      this.racesMap.set(race.id, {
        race,
        finishedUserIds,
        runnerIds,
        line,
        totalDistanceInMeters
      })
    }
  }
  
  async startEventSending() {
    this.logger.verbose(`Start emitting`)
    this.emitTimeout = setInterval(async () => {
      // this.logger.verbose(`Starting recurrent event sending`)
  
      const emus = this.emulatedRace
      if(emus.length) {
        for(const race of emus) {
          if(!race.isRunning()) continue
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

      if(!lastSecondEvents.length) {
        // this.logger.verbose(`Skipping procedure: 0 events concerned`)
        return
      }
      // this.logger.verbose(`${lastSecondEvents.length} events concerned`)

      const pipeline = Redis.pipeline()
      for(const entry of lastSecondEvents) {
        pipeline.zrange(`race:${entry.raceId}:finishers`, 0, -1, 'WITHSCORES')
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
        for (let i = 0; i < lastSecondEvents.length; i++) {
          const finishersResult = pipelineResults[i * 2]
          const rankingResult = pipelineResults[i * 2 + 1]
        
          const rawFinishers = finishersResult[1] as string[]
          const rawRanking = rankingResult[1] as string[]
        
          const finisherSet = new Set<string>()
          const ranking: [string, number][] = []
        
          for (let j = 0; j < rawFinishers.length; j += 2) {
            const finisherId = rawFinishers[j]
            finisherSet.add(finisherId)
            ranking.push([finisherId, -1])
          }
        
          for (let j = 0; j < rawRanking.length; j += 2) {
            const runnerId = rawRanking[j]
            if (finisherSet.has(runnerId)) continue
            ranking.push([runnerId, +Number(rawRanking[j + 1]).toFixed(4)])
          }
        
          lastSecondEvents[i].ranking = ranking
        }
        
      }

      for(const entry of lastSecondEvents) {
        const { positions, ranking } = entry

        if(!positions.length) {
          // this.logger.verbose(`Skipping ${entry.raceId}, 0 positions to update`)
          continue
        }

        const clientPoolSize = this.gatewayWsServer.sockets.adapter.rooms.get(entry.raceId)?.size
        if(clientPoolSize) {
          this.logger.verbose(`Emitting ${positions.length} positions to ${clientPoolSize} clients`)
        }
        this.gatewayWsServer.to(entry.raceId)
        .emit('positions', { positions, ranking })

        positions.splice(0, positions.length)
        ranking.splice(0, ranking.length)
      }
  
    }, 1000)
  }

  async registerRace(body: RegisterRaceDTO) {

    const xmlParser = new XMLParser({ ignoreAttributes: false })
    const gpxData = xmlParser.parse(body.gpx)
    const points = getPointsFromGpx(gpxData)
    const line = lineString(points.map(({ lat, lon }) => [lon, lat]))

    this.racesMap.set(body.id, {
      race: body,
      totalDistanceInMeters: length(line, { units: "meters" }),
      runnerIds: new Set(body.runnerIds),
      finishedUserIds: new Set(),
      line,
    })
    this.gatewayWsServer.emit('added-race', {
      id: body.id,
      startDate: body.startDate,
      endDate: body.endDate,
      geometry: line.geometry
    })
    return Redis.registerRace({ ...body, positions: points })
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

  async emulate({ runnerCount, gpxFile }: { runnerCount: string, gpxFile: string }) {
    const id = crypto.randomUUID()
    const startDate = new Date(Date.now() + 10000)
    const endDate = new Date(startDate.getTime() + 6 * 60 * 60 * 1000)
    const runnerIds = Array.from({ length: +runnerCount }).map(_ => crypto.randomUUID())
    const gpx = simplifyGpx((await fs.readFile(`./public/gpxs/${gpxFile}`)).toString())

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
    this.logger.verbose(`Position received from user: #${userId} (${JSON.stringify(data)})`)
    
    if(!userId) return

    const raceId = data.raceId
    
    const cache = this.racesMap.get(raceId)
    if(!cache) return

    const { race, runnerIds, line, finishedUserIds, totalDistanceInMeters } = cache

    
    const startDate = new Date(race.startDate)
    const endDate = new Date(race.endDate)
    const currentDate = new Date()
    if(currentDate < startDate || currentDate >= endDate) return

    if(finishedUserIds.has(userId)) return
    if(!runnerIds.has(userId)) return
    
    const timestamp = Date.now()
    const { lon, lat, alt } = data.position
    const cleanLon = lon
    const cleanLat = lat
    const cleanAlt = alt
    const p = point([lon, lat]);
    const snapped = nearestPointOnLine(line, p, { units: 'meters' });
    const progress = snapped.properties.location;
    const hasFinished = progress >= (totalDistanceInMeters - 1)

    if(hasFinished) {
      finishedUserIds.add(userId)
    }

    Redis.storePositionAndProgress(raceId, userId, { timestamp, ...data.position }, progress, hasFinished)

    const lastSecondeRacePositions = this.lastSecondEvents.get(raceId)
    const entry: WsSendPositions[number] = [userId, cleanLon, cleanLat, cleanAlt]

    if(!lastSecondeRacePositions) {
      this.lastSecondEvents.set(raceId, [entry])
    } else {
      lastSecondeRacePositions.push(entry)
    }
  }

  async getRaceRanking(raceId: string) {
    
    const pipeline = Redis.pipeline()
    pipeline.zrange(`race:${raceId}:finishers`, 0, -1, 'WITHSCORES')
    pipeline.zrevrange(`race:${raceId}:ranking`, 0, -1, 'WITHSCORES')
    const pipelineResults = await pipeline.exec()

    if(!pipelineResults) {
      this.logger.error(`No pipeline response`)
    } else if(!pipelineResults[0]) {
      this.logger.error(`Pipeline result empty`)
    } else if (pipelineResults[0][0]) {
      this.logger.error(`Ranking recuperation error: ${pipelineResults[0][0].message}`)
    } else {
      const finishersResult = pipelineResults[0]
      const rankingResult = pipelineResults[1]
      
      const rawFinishers = finishersResult[1] as string[]
      const rawRanking = rankingResult[1] as string[]
      
      const finisherSet = new Set<string>()
      const ranking: [string, number][] = []
      
      for (let j = 0; j < rawFinishers.length; j += 2) {
        const finisherId = rawFinishers[j]
        finisherSet.add(finisherId)
        ranking.push([finisherId, -1])
      }
      
      for (let j = 0; j < rawRanking.length; j += 2) {
        const runnerId = rawRanking[j]
        if (finisherSet.has(runnerId)) continue
        ranking.push([runnerId, +Number(rawRanking[j + 1]).toFixed(4)])
      }
      
      return ranking
    }
  }

  async getRaces() {
    const ids = await Redis.smembers("races");
    if(!ids.length) return []
    return Array.from(this.racesMap).map(([id, race]) => ({ ...race.race, geometry: race.line.geometry }))
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

  async getRaceStats(raceId: RaceId): Promise<RaceStats> {
    const race = this.racesMap.get(raceId)
    if(!race) throw new NotFoundException()
    const raceStartDate = new Date(race.race.startDate)
    const runnerIds = await Redis.smembers(`race:${raceId}:users`);
    const p = Redis.pipeline()
    for(const runnerId of runnerIds) {
      p.zrangeBuffer(`race:${raceId}:user:${runnerId}:positions`, 0, -1, 'WITHSCORES')
    }
    const runnerPositionsBufferResults = await p.exec()

    if(!runnerPositionsBufferResults) throw new Error()

    const finalRanking: RaceStats['finalRanking'] = []

    for(let i = 0; i < runnerPositionsBufferResults.length; i++) {
      const positions: RaceStats['finalRanking'][number]['positions'] = []
      const positionBufferAndTimestampBuffers = runnerPositionsBufferResults[i][1] as Buffer[]
      const userId = runnerIds[i]
      const avgKmHSpeed = (race.totalDistanceInMeters / 1000) / ((new Date(+positionBufferAndTimestampBuffers.at(-1)!).getTime() - raceStartDate.getTime()) / 3600000)
      for(let j = 0; j < positionBufferAndTimestampBuffers.length; j += 2) {
        const { lon, lat, alt } = decodePositionBuffer(positionBufferAndTimestampBuffers[j])
        const timsetamp = +positionBufferAndTimestampBuffers[j + 1]
        positions.push([timsetamp, lon, lat, alt])
      }
      finalRanking.push({
        userId,
        avgKmHSpeed,
        maxKmHSpeed: avgKmHSpeed * (1.2 + Math.random() * .2),
        positions,
      })
    }

    const avgSpeeds = finalRanking.map(fr => fr.avgKmHSpeed)
    const maxSpeeds = finalRanking.map(fr => fr.maxKmHSpeed)
    
    return {
      avgKmHSpeed: avgSpeeds.reduce((a, b) => a + b, 0) / avgSpeeds.length,
      maxKmHSpeed: Math.max(...maxSpeeds),
      finalRanking: finalRanking.sort((a, b) => b.avgKmHSpeed - a.avgKmHSpeed)
    }
  }

  async createReplay(body: CreateReplayDto) {
    const {
      id,
      startDate,
      files,
      name,
    } = body

    const xmlParser = new XMLParser({ ignoreAttributes: false })
    const gpxs = files.map(f => xmlParser.parse(f.buffer.toString('utf8')))
    const points = gpxs.map(gpx => getPointsFromGpx(gpx))

    const line = lineString(points[0].map(({ lat, lon }) => [lon, lat]))

    const userIds = Array.from({ length: points.length }).map(_ => crypto.randomUUID())
    console.log(points)
    const progress: {
      userId: string
      progress: number[]
    }[] = []
    const rankingOverTime: string[][] = []
    for(let i = 0; i < points.length; i++) {
      const userId = userIds[i]
      console.log(userId)
      const pts = points[i]
      const cumulatedDistance: number[] = []
      let j = 0
      for(const {lat, lon} of pts) {
        j++
        console.log(`${j} / ${pts.length + 1}`)
        const p = point([lon, lat]);
        const snapped = nearestPointOnLine(line, p, { units: 'meters' });
        const progress = snapped.properties.location;
        cumulatedDistance.push(progress)
      }
      progress.push({
        userId,
        progress: cumulatedDistance
      })
    }

    let i = 0
    let done: string[] = []
    while(true) {
      // const doneOnThisSec = progress.filter(p => p.progress.length === i + 1)
      // if(doneOnThisSec.length) {
      //   done.push(...doneOnThisSec.map(({ userId }) => userId))
      // }

      // let ranking: string[] = [...done]
      // const stillRunning = progress.filter(({ userId }) => !ranking.includes(userId))
      // if(!stillRunning.length) break

      // const sorted = stillRunning.sort((a, b) => b.progress[i] - a.progress[i])

      // ranking.push(...sorted.map(({ userId }) => userId))
      // rankingOverTime.push(ranking)

      // i++

      const running = progress
        .map(p => ({
          ...p,
          distance: p.progress[Math.min(i, p.progress.length - 1)],
          finished: i >= p.progress.length - 1
        }));

      if (running.every(r => r.finished)) {
        break;
      }

      running.sort((a, b) => b.distance - a.distance);

      rankingOverTime.push(running.map(r => r.userId));

      i++;
    }

    console.log(rankingOverTime)

    let gpx = 
`<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1">
  <trk>
    <trkseg>
      ${points[0].map(({ lat, lon }) =>
`<trkpt lat="${lat}" lon="${lon}"></trkpt>`
      ).join(``)}
    </trkseg>
  </trk>
</gpx>
`

    const str = JSON.stringify({
      id,
      name,
      startDate, 
      ranking: rankingOverTime,
      positions: userIds.map((id, i) => ({
        id,
        positions: points[i].map(({ lat, lon }) => [lon, lat])
      })),
      gpx,
    }, null, 2)

    if(process.env.NODE_ENV === "development") {
      await fs.writeFile(`./generated/${id}.json`, str)
      await fs.writeFile(`./generated/${id}.gpx`, gpx)
    }
  }

  async uploadReplay(file: CreateReplayDto['files'][number]) {
    const replay: ReplayJson = JSON.parse(file.buffer.toString('utf8'))
    this.replays.set(replay.id, replay)
  }

  getReplays() {
    return Array.from(this.replays)
  }

  getReplay(id: string) {
    const replay = this.replays.get(id)
    if(!replay) throw new NotFoundException()
    return replay
  }
}
