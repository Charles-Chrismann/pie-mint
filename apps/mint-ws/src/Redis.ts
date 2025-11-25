import Redis from "ioredis";
import { Race } from "./declarations";

class RedisInstance extends Redis {
	constructor() {
		super(process.env.REDIS_URL!)
	}

	async registerRace({ id, startDate, endDate, runnerIds }: Race) {
		console.log({ id, startDate, endDate, runnerIds })
		await Promise.all([
			this.sadd("races", id),
			this.hset(`race:${id}`, {
				id,
				startDate,
				endDate,
			}),
			this.sadd(`race:${id}:users`, ...runnerIds),
		])
	}
}

export default new RedisInstance