import { length } from "@turf/turf";
import { AccelerationPhase, Position3D } from "./declarations";
import {
  pointAtDistanceOnSegment,
  randomGaussian
} from "./utils";
import { Feature, GeoJsonProperties, LineString } from "geojson";

export class Runner {
  runnerId: string
  raceId: string
  points: Buffer
  avgSpeedKmh: number
  avgSpeedMs: number
  segments: {
    start: [number, number]
    end: [number, number]
    distance: number
  }[] = []
  path: Feature<LineString, GeoJsonProperties>

  constructor(
    runnerId: string,
    raceId: string,
    points: Position3D[],
    segments: typeof this.segments,
    path: typeof this.path,
  ) {
    this.runnerId = runnerId
    this.raceId = raceId
    
    this.avgSpeedKmh = randomGaussian();
    this.avgSpeedMs = this.avgSpeedKmh / 3.6;
    this.segments = segments
    this.path = path

    this.generatePoints(points)
  }

  getPosition(elapsedTime: number) {
    const stride = 12;
    const offset = elapsedTime * stride;
    if(this.points.byteLength <= offset) return null
    const lat = this.points.readInt32LE(offset) / 1e6;
    const lon = this.points.readInt32LE(offset + 4) / 1e6;
    const alt = this.points.readInt32LE(offset + 8) / 1e2;
    return {lat, lon, alt}
  }

  generatePoints(points: Position3D[]) {
    const totalDistance = length(this.path, { units: "meters" })
    let runnerCumultateDistance = 0
    const {lon, lat, alt} = points[0]
    const runnerPositions = [{lon, lat, alt}]
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

    let currentSegmentIndex = 0
    let cumulateSegmentDistance = 0

    while(runnerCumultateDistance < totalDistance) {
      runnerCumultateDistance += Math.random() * 10
      updatePhase()

      let segment = this.segments[currentSegmentIndex]
      while(cumulateSegmentDistance + segment.distance < runnerCumultateDistance) {
        cumulateSegmentDistance += segment.distance
        currentSegmentIndex++
        const nextSegment = this.segments[currentSegmentIndex]
        if(!nextSegment) break
        segment = nextSegment
      }

      const { lon, lat } = pointAtDistanceOnSegment(segment.start, segment.end, runnerCumultateDistance - cumulateSegmentDistance)
      runnerPositions.push({ lon, lat, alt: 0 })
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
}
