export type standard_distance = 'Marathon'

export interface Track {
  name: string,
  gpx?: string
}

export interface StartWave {
  name: string
  start_time: Date
  wave_index: number
  is_elite: boolean
}

export interface Race {
  name: string
  distance?: string
  positive_elevation?: string
  standard_distance?: standard_distance
  race_discipline_id: number

  track: Track
  start_waves?: StartWave[]
}

export interface EventCampaign {
  name: string
  description: string
}

export interface Event {
  name: string
  start_date: Date
  end_date: Date
  event_campaign?: EventCampaign

  races: Race[]
}

export interface Organization {
  name: string
  events: Event[]
}

export interface SeedEventQueryResult {
  id: number;
  name: string | null;
  organization_id: number;
  description: string | null;
  start_date: Date | null;
  end_date: Date | null;
}[]

export interface Sponsor {
  id: number
  name: string
  media_avatar_id?: number
  media_banner_id?: number
  created_by_id?: number
  owner_id?: number
}

export interface DBSeedUser {
  id: number
  email: string
  password?: string
  refresh_token?: string
}

export interface DBSeedUserProfile {
  user_id: number
  firstname: string
  lastname: string
  country_id?: number
  avatar_media_id?: number
  avatar_url?: string
  banner_media_id?: number
  banner_url?: string
  subscription_tier_id: number
}

export interface DBSeedMedia {
  url: string
  is_system: string

  created_by_id: string | null | undefined
  organization_id: string | null | undefined
  event_id: string | null | undefined
  race_id: string | null | undefined
}