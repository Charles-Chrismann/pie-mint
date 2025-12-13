export interface Position3D {
  lat: number
  lon: number
  alt: number
}

export type Position3DWithTimestamp = Position3D & {
  timestamp: number
}

export interface AccelerationPhase {
  intensity: number
  duration: number
  startedSince: number
}
