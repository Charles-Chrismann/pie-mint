import dotenv from 'dotenv'
dotenv.config({ path: '../.env.ws-tests' })
import { db } from '../../mint-server/src/db'
import { schema, tracks_table, users_table } from '../../mint-server/src/db/schema'

import * as fs from 'fs/promises'
import { position3D, runnerRace, runnerRaceWithGpx } from "./declarations";
import { Runner } from "./runner";
import { XMLParser } from "fast-xml-parser";
import { getPointsFromGpx } from './utils';
import { eq, sql } from '../../mint-server/node_modules/drizzle-orm'
import { API_BASE_URL, WS_URL } from './constants'

const RUNNER_COUNT = process.env.RUNNER_COUNT ? parseInt(process.env.RUNNER_COUNT) : 10

const runsPool: runnerRaceWithGpx[] = []

async function main() {

  const registrations = await db.query.registrations_table.findMany({
    with: {
      user_profile: {
        with: {
          user: true
        }
      }
    },
    limit: RUNNER_COUNT
  })

  console.log(registrations)

  let runsFile: Buffer | null = null
  try {
    runsFile = await fs.readFile('./runs.json')
  } catch (e) { }

  // const runnerData: runnerRace[] = runsFile ? JSON.parse((runsFile).toString()) : [{
  const runnerData: runnerRace[] = [{
    "runnerName": "Charles Chrismann",
    "stravaProfile": "https://www.strava.com/athletes/111252688",
    "stravaActivity": "https://www.strava.com/activities/14300288106",
    "fileName": "nantes_marathon.gpx"
  }]

  const xmlParser = new XMLParser({ ignoreAttributes: false })

  // for (const r of runnerData) {
  //   const gpxData = xmlParser.parse(await fs.readFile('./runs/' + r.fileName))
  //   const points = getPointsFromGpx(gpxData)
  //   runsPool.push({
  //     ...r,
  //     points
  //   })
  // }

  const segments: { coordinates: position3D[] } = await(await fetch(`${API_BASE_URL}/races/1/track`)).json()
  const race: position3D[] = segments.coordinates.slice(500)

  const runners = registrations.map((registration) => {

    return new Runner(
      WS_URL,
      race,
      registration.user_profile.user.email,
      (
        registration.user_profile.firstname === "Charles" &&
        registration.user_profile.lastname === "Chrismann"
      ) ? Math.floor(.90 * race.length) : Math.floor(Math.random() * .85 * race.length)
    )
  })

  await Promise.all(runners.map(r => r.login()))

  console.log(`Emulation started with ${registrations.length} runners, seending events to: ${WS_URL}`)

  for (let r of runners) {
    setTimeout(() => r.startRace(), Math.random() * 5000)
  }

}


main()