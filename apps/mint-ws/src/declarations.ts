import { Feature, GeoJsonProperties, LineString } from 'geojson';
import { z } from 'zod';

export interface JWTPayload {
	userId: string
}

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  PORT: z.string().min(1).transform(Number).default(3000),
  JWT_SECRET: z.string().min(1),
  SIGNATURE_SECRET: z.string().min(1),
  REDIS_URL: z.url(),
  LOGGER_VERBOSE: z.boolean().default(true)
});

export type Env = z.infer<typeof envSchema>;

export interface PositionPayload {
  raceId: string
  position: {
    lon: number,
    lat: number,
    alt: number
  }
}

export interface Race {
  id: string
  startDate: string
  endDate: string
  runnerIds: string[]
}

export interface CustomizedPoint {
  timestamp: number
  lat: number
  lon: number
  alt: number
}

export type FlatPosition = [number, number, number, number |null]

export type RaceId = string
export type UserId = string
export type Timestamp = number
export type lon = number
export type lat = number
export type alt = number
export type progress = number
export type WsSendPositions = [UserId, lon, lat, alt][]

export interface RaceStats {
  avgKmHSpeed: number
  maxKmHSpeed: number
  finalRanking: {
    userId: UserId
    avgKmHSpeed: number
    maxKmHSpeed: number
    positions: FlatPosition[]
  }[]
}

export interface RacesMapValues {
  race: Race,
  runnerIds: Set<string>,
  finishedUserIds: Set<string>,
  totalDistanceInMeters: number
  line: Feature<LineString, GeoJsonProperties>
}

export interface ReplayJson {
  id: string
  name: string
  startDate: string
  ranking: string[][]
  positions: {
    userId: string
    positions: [number, number][]
  }[]
  gpx: string
}
