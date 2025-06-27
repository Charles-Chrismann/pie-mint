export type standard_distance = 'Marathon'

export interface Track {
  name: string,
  gpx?: string
}

export interface SubEvent {
  name: string
  distance?: string
  positive_elevation?: string
  standard_distance?: standard_distance

  track: Track
}

export interface Event {
  name: string
  start_date: Date
  end_date: Date

  sub_events: SubEvent[]
}

export interface Organization {
  name: string
  events: Event[]
}

export interface SeedEventQueryResult {
  id: number;
  name: string | null;
  organization_id: number;
  is_auto_generated: boolean | null;
  description: string | null;
  start_date: Date | null;
  end_date: Date | null;
}[]