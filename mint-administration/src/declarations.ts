import * as L from 'leaflet'

export interface Track {
  track: {
    id: number
    name: string
  },
  points: {
    id: number
    lat: number
    lng: number
    alt: number
    is_first_point: boolean
    is_last_point: boolean
    track_id: number
  }[]
  segments: {
    id: number
    track_id: number
    start_position_id: number
    end_position_id: number
  }[]
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