export interface position3D {
  lat: number
  lon: number
  alt: number
}

export type Position3DWithTimestamp = position3D & {
  timestamp: number
}

export interface AccelerationPhase {
  intensity: number
  duration: number
  startedSince: number
}
