import { io, Socket } from "socket.io-client";
import { position2D, position3D } from "./declarations";

export class Runner {
  io: Socket
  name: string
  points: position3D[]
  positionIntervalId!: NodeJS.Timeout
  currentPointsIndex = -1

  constructor(
    wsUrl: string,
    name: string,
    points: position3D[]
  ) {
    this.io = io(wsUrl)
    this.name = name + String(Math.random())
    this.points = points
  }

  startRace() {
    setTimeout(() => {
      this.positionIntervalId = setInterval(() => this.updatePosition(), 1000)
    }, Math.random() * 300)
  }

  updatePosition() {
    this.currentPointsIndex++

    const p = {
      lat: this.points[this.currentPointsIndex].lat + this.getImprecision(),
      lng: this.points[this.currentPointsIndex].lng + this.getImprecision()
    }

    this.io.emit('position', {
      position: p,
      name: this.name
    })
  }

  getImprecision() {
    const imprecisionPool = [-0.000004, -0.000003, -0.000002, -0.000001, 0, 0.000001, 0.000002, 0.000003, 0.000004]
    return imprecisionPool[Math.floor(Math.random()*imprecisionPool.length)]
  }
}