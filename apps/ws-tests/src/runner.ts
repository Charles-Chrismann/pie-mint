import { io, Socket } from "socket.io-client";
import { position2D, position3D, RunnerAuth } from "./declarations";
import { API_BASE_URL, WS_URL } from "./constants";
import jwt from "jsonwebtoken"

export class Runner {
  io: Socket
  runnerId: string
  raceId: string
  points: position3D[]
  positionIntervalId!: NodeJS.Timeout
  currentPointsIndex = -1
  auth: string

  pcount = 0

  constructor(
    runnerId: string,
    raceId: string,
    points: position3D[],
    currentPointsIndex?: number,
  ) {
    this.runnerId = runnerId
    this.raceId = raceId
    this.points = points
    this.auth = jwt.sign({ userId: this.runnerId }, process.env.JWT_SECRET!)
    this.io = io(WS_URL, { auth: { token: this.auth } })
    // if(currentPointsIndex) this.currentPointsIndex = currentPointsIndex
  }

  startRace() {
    this.positionIntervalId = setInterval(() => this.updatePosition(), 1000)
  }

  stopRace() {
    if(this.positionIntervalId) clearInterval(this.positionIntervalId)
  }

  updatePosition() {
    this.currentPointsIndex++

    // if(!this.points[this.currentPointsIndex]) return this.stopRace()

    const p = {
      lon: this.points[this.currentPointsIndex].lon + this.getImprecision(),
      lat: this.points[this.currentPointsIndex].lat + this.getImprecision(),
      alt: this.points[this.currentPointsIndex].alt,
    }

    // this.io.emit('position', {
    //   position: p,
    //   runner_id: this.auth!.user_profile.id,
    //   name: `${this.auth!.user_profile.firstname} ${this.auth!.user_profile.lastname}`,
    //   rank: this.currentPointsIndex
    // })

    this.io.emit('position', {
      raceId: this.raceId,
      position: p
    })
  }

  getImprecision() {
    if (true) return 0
    const imprecisionPool = [-0.000004, -0.000003, -0.000002, -0.000001, 0, 0.000001, 0.000002, 0.000003, 0.000004]
    return imprecisionPool[Math.floor(Math.random() * imprecisionPool.length)]
  }
}