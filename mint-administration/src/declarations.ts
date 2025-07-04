import * as L from 'leaflet'
import type { MAP_STYLES } from './constants';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';


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
  created_by_id: number
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

export interface Registration {
  id: number
  is_private?: boolean
  bib_number?: number
  alias?:string
  user_profile_id: number
  sub_event_id: number
  sub_event_start_wave_id: number
  is_accepted: boolean
}

export interface SubEventRegistrationRunners {
  registrations: Registration
  user_profiles: UserProfile
}

export interface TechnicalUser {
  id: number
  email: string
}

export interface UserProfile {
  id: number
  firstname: string
  lastname: string
  user_id: number
}

export interface ApiResponseLogin {
  technicalUser: TechnicalUser
  userProfile: UserProfile
  access_token: string
  refresh_token: string
}

export interface ApiResponseCreateOrganization {
  id: number
  name: string
  media_avatar_id: number
  media_banner_id: number
  created_by_id: number
  owner_id: number
}

export type ApiResponseGetOrganizationTracks = {
  tracks: {
    id: number
    name: string
  }
  sub_events: SubEvent
  track_points: TrackPoint[]
}[]

export interface FormAddRunner {
  user_profile_id?: number | null;
  is_private?: boolean | null;
  bib_number?: number | null;
  bib_alias?: string | null;
  sub_event_start_wave_id?: number | null;
}

export type MapStyleKey = keyof typeof MAP_STYLES;