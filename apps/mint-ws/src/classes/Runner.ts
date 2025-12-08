import { length, lineString } from "@turf/turf";
import { AccelerationPhase, position3D } from "./declarations";
import {
  getBornPoints,
  getPointsTotalDistance,
  interpolatePoint,
  randomGaussian
} from "./utils";

export class Runner {
  runnerId: string
  raceId: string
  points: Buffer
  avgSpeedKmh: number
  avgSpeedMs: number

  constructor(
    runnerId: string,
    raceId: string,
    points: position3D[],
  ) {
    this.runnerId = runnerId
    this.raceId = raceId
    
    this.avgSpeedKmh = randomGaussian();
    this.avgSpeedMs = this.avgSpeedKmh / 3.6;

    this.generatePoints(points)
  }

  getPosition(elapsedTime: number) {
    const stride = 12;
    const offset = elapsedTime * stride;
    const lat = this.points.readInt32LE(offset) / 1e6;
    const lon = this.points.readInt32LE(offset + 4) / 1e6;
    const alt = this.points.readInt32LE(offset + 8) / 1e2;
    return {lat, lon, alt}
  }

  generatePoints(points: position3D[]) {
    const totalDistance = getPointsTotalDistance(points)
    const secondsToFinishRace = Math.ceil(totalDistance / this.avgSpeedMs)
    let raceCumultateDistance = 0
    let runnerCumultateDistance = 0
    const runnerPositions = [points[0]]
    const phase: AccelerationPhase = {
      intensity: Math.random() * 0.2 + .1,
      duration: Math.ceil(Math.random() * 480 + 120),
      startedSince: 0
    }

    function updatePhase() {
      phase.startedSince++

      if(phase.intensity === 0) {

      } else {
        if(phase.duration === phase.startedSince) {
          setAvgPhase()
        }
      }
    }

    function setAvgPhase() {
      phase.duration = -1
      phase.intensity = 0
      phase.startedSince = 0
    }

    while(runnerCumultateDistance < totalDistance) {
      runnerCumultateDistance += this.avgSpeedMs * (1 + phase.intensity)
      updatePhase()


      const bornes = getBornPoints(points, runnerCumultateDistance)
      if(Array.isArray(bornes)) {
        const position = interpolatePoint(bornes[0], bornes[1], 0.5) // TODO: check this
        runnerPositions.push(position)
      } else if(bornes !== null) {
        runnerPositions.push(bornes)
      }
    }

    const buf = Buffer.alloc(runnerPositions.length * 3 * 4);
    let offset = 0;
    for (const rp of runnerPositions) {
      buf.writeInt32LE(Math.round(rp.lat * 1e6), offset);
      offset += 4;

      buf.writeInt32LE(Math.round(rp.lon * 1e6), offset);
      offset += 4;

      buf.writeInt32LE(Math.round(rp.alt * 1e2), offset); // cm si tu veux
      offset += 4;
    }

    this.points = buf
    // console.log(`${this.runnerId}: ${this.points.length} generated (${this.avgSpeedKmh} avg speed)(will finish race in ${this.points.length / 3600}h)`)
  }

  // emitPosition(elapsedTime: number) {
  //   const position = this.getPosition(elapsedTime)
  //   this.io.emit('position', {
  //     raceId: this.raceId,
  //     position: position
  //   })
  // }
}
