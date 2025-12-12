import { XMLParser } from "fast-xml-parser";
import { Runner } from "./Runner";
import { getPointsFromGpx, gpxPointsToEquidistantPoints } from "./utils";
import { position3D } from "./declarations";

export class EmulatedRace {
	id: string
	startDate: Date
	endDate: Date
	progress = 0
	gpx: string
	points: position3D[]
	runners: Runner[] = []

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
		this.createRunners(runnerIds)
	}

	setPoints() {
		const xmlParser = new XMLParser({ ignoreAttributes: false })
		const gpxData = xmlParser.parse(this.gpx)
		const points = getPointsFromGpx(gpxData)
		this.points = gpxPointsToEquidistantPoints(points)
	}

	createRunners(runnerIds: string[]) {
		for(const id of runnerIds) {

			const runner = new Runner(
				id,
				this.id,
				this.points
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