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