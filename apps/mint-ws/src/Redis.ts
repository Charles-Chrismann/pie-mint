import Redis from "ioredis";
import { Race, RaceId } from "./declarations";
import { Position3D, Position3DWithTimestamp } from "./classes/declarations";
import { encodePositionBuffer, encodeRacePositionsBuffer } from "./classes/utils";

class RedisInstance extends Redis {
	constructor() {
		super(process.env.REDIS_URL!)
	}

	async registerRace({ id, startDate, endDate, runnerIds, positions }: Race & { positions: Position3D[] }) {
		const pipeline = await this.multi()
		.sadd("races", id)
		.set(`race:${id}`, JSON.stringify({
			id,
			startDate,
			endDate,
		}))
		.set(`race:${id}:points`, encodeRacePositionsBuffer(positions))
		.sadd(`race:${id}:users`, ...runnerIds)
		.exec()
	}

	async storePositionAndProgress(
		raceId: string,
		userId: string,
		position: Position3DWithTimestamp,
		progress: number,
		hasFinished: boolean
	) {
		const pipeline = this.pipeline()
    pipeline.zadd(`race:${raceId}:user:${userId}:positions`,
			position.timestamp,
			encodePositionBuffer(position),
    )
		if(hasFinished) {
			pipeline.zadd(`race:${raceId}:finishers`, 
				position.timestamp,
				userId
			);
		}
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
		pipeline.del(`race:${raceId}:points`)
		pipeline.del(`race:${raceId}:finishers`)
		await pipeline.exec()
	}
}

export default new RedisInstance