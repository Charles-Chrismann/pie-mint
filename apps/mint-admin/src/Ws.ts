import config from "./config"
import type { Race } from "./declarations"

class Ws {
	private WS_BASE_HOST: string = config.WS_URL

	async getRunningRaces(): Promise<Race[]> {
		const res = await fetch(`${this.WS_BASE_HOST}/races`)
		const races = await res.json() as Race[]
		return races
	}

	async emulateRace({ runnerCount, gpx }: { runnerCount: string, gpx: string }) {
		const url = new URL(`${this.WS_BASE_HOST}/races/emulate`)
		url.searchParams.set('runnerCount', runnerCount)
		url.searchParams.set('gpx', gpx)
		const res = await fetch(url.toString())
		const race = await res.json()
		return race
	}

	async getRaces(): Promise<Race[]> {
		const res = await fetch(`${this.WS_BASE_HOST}/races`)
		const races = await res.json() as Race[]
		return races
	}
}

export default new Ws