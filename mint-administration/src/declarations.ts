import * as L from 'leaflet'

export interface Track {
  track: {
    id: number
    name: string
  },
  points: TrackPoint[]
  segments: {
    id: number
    track_id: number
    start_position_id: number
    end_position_id: number
  }[]
}

export interface TrackPoint {
  id: number
  lat: number
  lng: number
  alt: number
  is_first_point: boolean
  is_last_point: boolean
  track_id: number
}

export interface LastUpdatedRunner {
  position: {
    lat: number,
    lng: number
  },
  name: string
}

export interface Runner {
  position: {
    lat: number,
    lng: number
  },
  name: string,
  marker: L.Marker
}

export interface Organization {
  id: number
  name: string
  media_avatar_id: number
  media_banner_id: number
  created_id: number
  owner_id: number
}

export interface Event {
  id: number
  name: string
  description: string | null
  start_date: string
  end_date: string
  organization_id: number
}

export interface SubEvent {
  id: number
  name: string
  distance: string | null
  positive_elevation: number | null
  event_id: number
  standard_distance_id: number | null
  track_id: number
}