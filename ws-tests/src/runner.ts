import { io, Socket } from "socket.io-client";
import { position2D, position3D, RunnerAuth } from "./declarations";
import { API_BASE_URL } from "./constants";

export class Runner {
  io: Socket
  points: position3D[]
  positionIntervalId!: NodeJS.Timeout
  currentPointsIndex = -1

  auth: RunnerAuth | null = null
  email: string
  pcount = 0

  constructor(
    wsUrl: string,
    points: position3D[],
    email: string,
    currentPointsIndex?: number,
  ) {
    this.io = io(wsUrl)
    this.io.on('position', () => console.log('posit', ++this.pcount))
    this.points = points
    this.email = email
    if(currentPointsIndex) this.currentPointsIndex = currentPointsIndex
  }

  async login() {
    const datas = await (await fetch(API_BASE_URL + '/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.email,
        password: 'password'
      })
    })).json()

    this.auth = {
      technical_user: datas.technicalUser,
      user_profile: datas.userProfile,
      access_token: datas.access_token,
      refresh_token: datas.refresh_token,
    }

    console.log(`${this.auth!.user_profile.firstname} ${this.auth!.user_profile.lastname} is connected!`)
  }

  startRace() {
    this.positionIntervalId = setInterval(() => this.updatePosition(), 1000)
  }

  stopRace() {
    if(this.positionIntervalId) clearInterval(this.positionIntervalId)
  }

  updatePosition() {
    this.currentPointsIndex++

    if(!this.points[this.currentPointsIndex]) return this.stopRace()

    const p = {
      lat: this.points[this.currentPointsIndex][1] + this.getImprecision(),
      lng: this.points[this.currentPointsIndex][0] + this.getImprecision()
    }

    this.io.emit('position', {
      position: p,
      runner_id: this.auth!.user_profile.id,
      name: `${this.auth!.user_profile.firstname} ${this.auth!.user_profile.lastname}`,
      rank: this.currentPointsIndex
    })
  }

  getImprecision() {
    if (true) return 0
    const imprecisionPool = [-0.000004, -0.000003, -0.000002, -0.000001, 0, 0.000001, 0.000002, 0.000003, 0.000004]
    return imprecisionPool[Math.floor(Math.random() * imprecisionPool.length)]
  }
}