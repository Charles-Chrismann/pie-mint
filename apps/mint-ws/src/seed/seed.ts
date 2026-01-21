import "dotenv/config"
import { XMLParser } from "fast-xml-parser";
import { chunkify } from "./utils";
import * as fs from "fs/promises"
import { CustomizedPoint } from "src/declarations";
import Redis from "src/Redis";
import { getPointsFromGpx } from "./utils";
import { encodePositionBuffer } from "src/classes/utils";

async function main() {

	const start = performance.now()

	const parser = new XMLParser({ ignoreAttributes: false })
	const gpxStr = await fs.readFile('./src/seed/nantes_marathon.gpx')
	const gpxData = parser.parse(gpxStr)
  const points = getPointsFromGpx(gpxData)
	const id = "abc"
	const startDate = "2025-04-27T07:15:00Z"
	const startDateMs = new Date(startDate).getTime()
	const endDate = "2025-04-27T16:15:50Z"
	const runnerIds = Array.from({ length: 1 }).map(() => crypto.randomUUID())

	await Redis.registerRace({ id, startDate, endDate, runnerIds, positions: points})

	for(const userId of runnerIds) {
		// const latPositionShift = 0.00001
		// const lngPositionShift = 0.00001
		const speedFactor = Math.max(Math.random() * 1.815277778, .3)
		const pointCount = points.length / speedFactor
		const customizedPoints: CustomizedPoint[] = []
		for(let i = 0; i < points.length; i++) {
			const p = points[i]
			const lat = Number((p.lat).toFixed(6))
			const lon = Number((p.lon).toFixed(6))
			const timestamp = startDateMs + 1000 * i + 10 + Math.floor(Math.random() * 20)
			customizedPoints.push({
				lat,
				lon,
				alt: p.alt,
				timestamp,
			})
		}

		const chunks = chunkify(customizedPoints)

		for(const chunk of chunks) {
			await Promise.all(
				chunk.map(cp => Redis.zadd(`user:${userId}:race:${id}:positions`, cp.timestamp, encodePositionBuffer(cp)))
			)
		}
	}

	console.log(`Redis DB seeded in ${performance.now() - start}ms`)
}

main()