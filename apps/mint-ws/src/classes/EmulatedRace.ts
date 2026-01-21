import { XMLParser } from "fast-xml-parser";
import { Runner } from "./Runner";
import { getPointsFromGpx, gpxPointsToEquidistantPoints } from "./utils";
import { Position3D } from "./declarations";
import { Feature, GeoJsonProperties, LineString } from "geojson";
import { distance, length, lineString } from "@turf/turf";

export class EmulatedRace {
	id: string
	startDate: Date
	endDate: Date
	progress = 0
	gpx: string
	points: Position3D[]
	runners: Runner[] = []
	segments: {
		start: [number, number]
		end: [number, number]
		distance: number
	}[] = []
	path: Feature<LineString, GeoJsonProperties>
	raceLengthInMeters: number

	constructor(
		id: string,
		startDate: Date,
		endDate: Date,
		gpx: string,
		runnerIds: string[]
	) {
		this.id = id
		this.startDate = startDate
		this.endDate = endDate
		this.gpx = gpx

		this.setPoints()
		this.path = lineString(this.points.map(({lon, lat}) => [lon, lat]))
		this.raceLengthInMeters = length(this.path)
		this.createSegments()
		this.createRunners(runnerIds)
	}

	setPoints() {
		const xmlParser = new XMLParser({ ignoreAttributes: false })
		const gpxData = xmlParser.parse(this.gpx)
		const points = getPointsFromGpx(gpxData)
		this.points = gpxPointsToEquidistantPoints(points)
	}

	createSegments() {
		for(let i = 0; i < this.path.geometry.coordinates.length - 1; i++) {
			const start = this.path.geometry.coordinates[i] as [number, number]
			const end = this.path.geometry.coordinates[i + 1] as [number, number]
			const distanceInMeter = distance(start, end, { units: "meters" })
			this.segments.push({
				distance: distanceInMeter,
				end,
				start
			})
		}
	}

	createRunners(runnerIds: string[]) {
		for(const id of runnerIds) {

			const runner = new Runner(
				id,
				this.id,
				this.points,
				this.segments,
				this.path
			)

			this.runners.push(runner)
		}
	}

	getPositions(elapsed: number) {
		return this.runners.map(r => {
			const position = r.getPosition(elapsed)
			if(!position) return null
			return {
				userId: r.runnerId,
				...position
			}
		}).filter(p => !!p)
	}

	isRunning() {
		const now = new Date()
		return now >= this.startDate && now < this.endDate
	}
}