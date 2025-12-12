import config from "./config"
import type { Race } from "./declarations"

class Ws {
	private WS_BASE_HOST: string = config.WS_URL

	async getRunningRaces(): Promise<Race[]> {
		const res = await fetch(`${this.WS_BASE_HOST}/races`)
		const races = await res.json() as Race[]
		return races
	}
}

export default new Ws