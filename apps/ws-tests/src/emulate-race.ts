import 'dotenv/config'
import jwt from "jsonwebtoken"
import { io, Socket } from "socket.io-client";
import { db } from '@repo/db'

import * as fs from 'fs/promises'
import { position3D, runnerRace, runnerRaceWithGpx } from "./declarations";
import { Runner } from "./runner";
import { XMLParser } from "fast-xml-parser";
import { API_BASE_URL, WS_URL } from './constants'
import { getDistanceBetweenPoints, getPointsFromGpx, getPointsTotalDistance, gpxPointsToEquidistantPoints, randomGaussian } from './utils';

const RUNNER_COUNT = process.env.RUNNER_COUNT ? parseInt(process.env.RUNNER_COUNT) : 10

const runsPool: runnerRaceWithGpx[] = []

async function main() {
  console.clear()

  const raceId = crypto.randomUUID()
  const startDate = new Date(Date.now() + 10000)
  const endDate = new Date(startDate.getTime() + 6 * 60 * 60 * 1000)
  const runnerIds = Array.from({ length: 1000 })
  .map(() => crypto.randomUUID())

  const res = await fetch(`${WS_URL}/race`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.SIGNATURE_SECRET!}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "id": raceId,
      "startDate": startDate.toISOString(),
      "endDate": endDate.toISOString(),
      runnerIds
    })
  })
  console.log(res.status)

  const xmlParser = new XMLParser({ ignoreAttributes: false })
  const gpxData = xmlParser.parse(await fs.readFile('./runs/nantes_marathon.gpx'))
  const points = getPointsFromGpx(gpxData)

  const equidistantPoints = gpxPointsToEquidistantPoints(points)
  // const equidistantPoints = gpxPointsToEquidistantPoints(points.slice(0, 1200))
  const runners = runnerIds.map((runnerId) => 
    new Runner(runnerId, raceId, equidistantPoints)
  )

  const start = Date.now();
  setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      for(const runner of runners) {
        runner.emitPosition(elapsed)
      }
    }, 1000);

  return


  // const xmlParser = new XMLParser({ ignoreAttributes: false })
  // const gpxData = xmlParser.parse(await fs.readFile('./runs/nantes_marathon.gpx'))
  // const points = getPointsFromGpx(gpxData)

  // const runners = runnerIds.map((runnerId) => 
  //   new Runner(points)
  // )

  

  

  return



  // console.log(process.env.SIGNATURE_SECRET)

  

  // // const registrations = await db.query.registrations_table.findMany({
  // //   with: {
  // //     user_profile: {
  // //       with: {
  // //         user: true
  // //       }
  // //     }
  // //   },
  // //   limit: RUNNER_COUNT
  // // })

  // // console.log(registrations)

  // // let runsFile: Buffer | null = null
  // // try {
  // //   runsFile = await fs.readFile('./runs.json')
  // // } catch (e) { }

  // // const runnerData: runnerRace[] = runsFile ? JSON.parse((runsFile).toString()) : [{
  // // const runnerData: runnerRace[] = [{
  // //   "runnerName": "Charles Chrismann",
  // //   "stravaProfile": "https://www.strava.com/athletes/111252688",
  // //   "stravaActivity": "https://www.strava.com/activities/14300288106",
  // //   "fileName": "nantes_marathon.gpx"
  // // }]

  // const xmlParser = new XMLParser({ ignoreAttributes: false })
  // const gpxData = xmlParser.parse(await fs.readFile('./runs/nantes_marathon.gpx'))

  // const points = getPointsFromGpx(gpxData)

  // // for (const r of runnerData) {
  // //   const gpxData = xmlParser.parse(await fs.readFile('./runs/' + r.fileName))
  // //   const points = getPointsFromGpx(gpxData)
  // //   runsPool.push({
  // //     ...r,
  // //     points
  // //   })
  // // }

  // // const segments: { coordinates: position3D[] } = await(await fetch(`${API_BASE_URL}/races/1/track`)).json()
  // // const race: position3D[] = segments.coordinates.slice(500)

  // const runners = runnerIds.map((runnerId) => 
  //   new Runner(
  //     runnerId,
  //     raceId,
  //     points
  //   )
  // )

  // console.log(`Emulation started with ${runners.length} runners, seending events to: ${WS_URL}`)

  // // for (let r of runners) {
  // //   setTimeout(() => r.startRace(), Math.random() * 5000)
  // // }

}


main()