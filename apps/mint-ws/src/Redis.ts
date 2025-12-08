import Redis from "ioredis";
import { Race } from "./declarations";
import { Position3DWithTimestamp } from "./classes/declarations";
import { encodePosition } from "./seed/utils";
import { encodePositionBuffer } from "./classes/utils";

class RedisInstance extends Redis {
	constructor() {
		super(process.env.REDIS_URL!)
	}

	async registerRace({ id, startDate, endDate, runnerIds }: Race) {
		await Promise.all([
			this.sadd("races", id),
			this.set(`race:${id}`, JSON.stringify({
				id,
				startDate,
				endDate,
			})),
			this.sadd(`race:${id}:users`, ...runnerIds),
		])
	}

	async storePositionAndProgress(raceId: string, userId: string, position: Position3DWithTimestamp, progress: number) {
		const pipeline = this.pipeline()
    pipeline.zadd(`race:${raceId}:user:${userId}:position:${position.timestamp}`,
      position.timestamp,
      encodePositionBuffer(position)
    )
		pipeline.zadd(`race:${raceId}:ranking`, progress, userId)

		return pipeline.exec()
	}
}

export default new RedisInstance