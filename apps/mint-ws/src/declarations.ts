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

export type RedisPosition = [number, number, number, number |null]

export type raceId = string
export type userId = string
export type lon = number
export type lat = number
export type alt = number
export type progress = number
export type WsSendPositions = [userId, lon, lat, alt][]
