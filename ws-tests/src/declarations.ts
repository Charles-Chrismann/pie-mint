export interface runnerRace {
  runnerName: string
  stravaProfile: string
  stravaActivity: string
  fileName: string
}

export type runnerRaceWithGpx = runnerRace & {
  points: position3D[]
}

export interface position2D {
  lat: number
  lng: number
}

export type position3D = position2D & {
  alt: number
}