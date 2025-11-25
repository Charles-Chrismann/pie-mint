import { Injectable, OnModuleInit, StreamableFile } from '@nestjs/common';
import Redis from './Redis';
import { createGPXString, decodePosition } from './seed/utils';
import * as fs from 'fs/promises'
import { Readable } from 'stream';
import { Race } from './declarations';

@Injectable()
export class AppService{

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
  
    const races = await Promise.all(
      ids.map(async id => ({
        id,
        ...await Redis.hgetall(`race:${id}`)
      }))
    );

    return races.filter((r: Race) => {
      const now = new Date()
      const start = new Date(r.startDate)
      const end = new Date(r.endDate)

      if(start >= now && end < now) return true

      return false
    })
  }
}
