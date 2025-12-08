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

export interface position3D {
  lat: number
  lon: number
  alt: number
}

export interface RunnerAuth {
  technical_user: TechnicalUser
  user_profile: UserProfile
  access_token: string
  refresh_token: string
}

export interface TechnicalUser {
  id: number,
  email: string
}

export interface UserProfile {
  id: number,
  firstname: string
  lastname: string
  user_id: string
}

export interface AccelerationPhase {
  intensity: number
  duration: number
  startedSince: number
}