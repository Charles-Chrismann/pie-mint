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
  start_time: Date

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