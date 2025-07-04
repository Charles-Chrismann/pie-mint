import dotenv from 'dotenv'
dotenv.config({ path: '../.env.ws-tests' })
import { db } from '../../mint-server/src/db'
import * as schema from '../../mint-server/src/db/schema'

import * as fs from 'fs/promises'
import { runnerRace, runnerRaceWithGpx } from "./declarations";
import { Runner } from "./runner";
import { XMLParser } from "fast-xml-parser";
import { getPointsFromGpx } from './utils';
import { eq } from 'drizzle-orm'

const RUNNER_COUNT = process.env.RUNNER_COUNT ? parseInt(process.env.RUNNER_COUNT) : 10

const runsPool: runnerRaceWithGpx[] = []

const WsUrl = process.env.WS_URL || 'http://localhost:3001'
const API_BASE_URL = (process.env.API_URL || 'http://localhost:3000') + '/api'

async function main() {

  const registrations = await (await fetch(API_BASE_URL + '/sub-events/2/runners')).json()

  console.log(registrations)

  let runsFile: Buffer | null = null
  try {
    runsFile = await fs.readFile('./runs.json')
  } catch (e) { }

  const runnerData: runnerRace[] = runsFile ? JSON.parse((runsFile).toString()) : [{
    "runnerName": "Charles Chrismann",
    "stravaProfile": "https://www.strava.com/athletes/111252688",
    "stravaActivity": "https://www.strava.com/activities/14027118099",
    "fileName": "lut-2025-37km.gpx"
  }]

  const xmlParser = new XMLParser({ ignoreAttributes: false })

  for (const r of runnerData) {
    const gpxData = xmlParser.parse(await fs.readFile('./runs/' + r.fileName))
    const points = getPointsFromGpx(gpxData)
    runsPool.push({
      ...r,
      points
    })
  }

  const runners = Array.from({ length: RUNNER_COUNT }).map((_, i) => {

    const race = runsPool[Math.floor(Math.random() * runsPool.length)]

    return new Runner(WsUrl, race.runnerName, race.points)
  })

  console.log(`Emulation started with ${RUNNER_COUNT} runners, seending events to: ${WsUrl}`)

  for (let r of runners) {
    r.startRace()
  }

}


main()