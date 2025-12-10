import Redis from "ioredis";
import { Race, RaceId } from "./declarations";
import { Position3DWithTimestamp } from "./classes/declarations";
import { encodePosition } from "./seed/utils";
import { encodePositionBuffer } from "./classes/utils";

class RedisInstance extends Redis {
	constructor() {
		super(process.env.REDIS_URL!)
	}

	async registerRace({ id, startDate, endDate, runnerIds }: Race) {
		const res = await Promise.all([
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
    pipeline.zadd(`race:${raceId}:user:${userId}:positions`,
      position.timestamp,
      encodePositionBuffer(position)
    )
		pipeline.zadd(`race:${raceId}:ranking`, progress, userId)

		return pipeline.exec()
	}

	async pruneRace(raceId: RaceId) {
		const pipeline = this.pipeline()

  	const userIds = await this.smembers(`race:${raceId}:users`);
		for (const userId of userIds) {
			pipeline.del(`race:${raceId}:user:${userId}:positions`);
		}

		pipeline.srem("races", raceId)
		pipeline.del(`race:${raceId}`)
		pipeline.del(`race:${raceId}:users`);
		pipeline.del(`race:${raceId}:ranking`)
		await pipeline.exec()
	}
}

export default new RedisInstance