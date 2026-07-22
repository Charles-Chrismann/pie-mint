export class Replay {
	isRunning = true
	raceId: string
	startDate: Date
	positions: Map<string, [number, number, number][]>
	constructor({
		raceId,
		startDate,
		positions,
	}: {
		raceId: string,
		startDate: string,
		positions: Map<string, [number, number, number][]>
	}) {
		this.raceId = raceId
		this.startDate = new Date(startDate),
		this.positions = positions
	}
}