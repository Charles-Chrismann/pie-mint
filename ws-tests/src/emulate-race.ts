import * as fs from 'fs/promises'
import { runnerRace, runnerRaceWithGpx } from "./declarations";
import { Runner } from "./runner";
import { XMLParser } from "fast-xml-parser";
import { getPointsFromGpx } from './utils';

const RUNNER_COUNT = 1000

const runsPool: runnerRaceWithGpx[] = []

console.log(`Start emulation...`)

const WsUrl = 'http://localhost:3001'

async function main() {

  const runnerData: runnerRace[] = JSON.parse((await fs.readFile('./runs.json')).toString())

  const xmlParser = new XMLParser({ ignoreAttributes: false })

  for(const r of runnerData) {
    const gpxData = xmlParser.parse(await fs.readFile('./runs/' + r.fileName))
    const points = getPointsFromGpx(gpxData)
    runsPool.push({
      ...r,
      points
    })
  }

  const runners = Array.from({length: RUNNER_COUNT}).map((_, i) => {

    const race = runsPool[Math.floor(Math.random()*runsPool.length)]

    return new Runner(WsUrl, race.runnerName, race.points)
  })

  for(let r of runners) {
    r.startRace()
  }
  
}


main()