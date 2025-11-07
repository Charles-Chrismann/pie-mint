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
  runner_id: number
  name: string,
  rank: number
}

export interface Runner {
  position: {
    lat: number,
    lng: number
  },
  runner_id: number,
  name: string,
  marker: L.Marker
  rank: number
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

export interface Race {
  id: number
  name: string
  distance: string | null
  positive_elevation: string | null
  event_id: number
  standard_distance_id: number | null
  track_id: number
}

export interface Registration {
  id: number
  is_private?: boolean
  bib_number?: number
  bib_alias?: string
  user_profile_id: number
  race_id: number
  race_start_wave_id: number
  is_accepted: boolean
  user_profile: UserProfile
  flag_emoji: string
}

export interface RaceRegistrationRunners {
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
  avatar_url: string
  banner_url: string
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
  races: Race
  track_points: TrackPoint[]
}[]

export interface FormAddRunner {
  user_profile_id?: number | null;
  is_private?: boolean | null;
  bib_number?: number | null;
  bib_alias?: string | null;
  race_start_wave_id?: number | null;
}

export type MapStyleKey = keyof typeof MAP_STYLES;

export interface FormUpdateRace {
  name?: string
  start_date?: Date
  distance?: string
  standard_distance_id?: number
  positive_elevation?: string
}

export interface StandardDistance {
  id: number
  name: string
  distance: string
}

// https://www.npmjs.com/package/@types/geojson?activeTab=code

export type GeoJsonGeometryTypes = Geometry["type"];

export type GeoJsonTypes = GeoJSON["type"];

export type BBox = [number, number, number, number] | [number, number, number, number, number, number];

export type Position = number[];

export interface GeoJsonObject {
  type: GeoJsonTypes;
  bbox?: BBox | undefined;
}

export type GeoJSON<G extends Geometry | null = Geometry, P = GeoJsonProperties> =
  | G
  | Feature<G, P>
  | FeatureCollection<G, P>;

export type Geometry = Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon | GeometryCollection;

export type GeometryObject = Geometry;

export interface Point extends GeoJsonObject {
  type: "Point";
  coordinates: Position;
}

export interface MultiPoint extends GeoJsonObject {
  type: "MultiPoint";
  coordinates: Position[];
}

export interface LineString extends GeoJsonObject {
  type: "LineString";
  coordinates: Position[];
}

export interface MultiLineString extends GeoJsonObject {
  type: "MultiLineString";
  coordinates: Position[][];
}

export interface Polygon extends GeoJsonObject {
  type: "Polygon";
  coordinates: Position[][];
}

export interface MultiPolygon extends GeoJsonObject {
  type: "MultiPolygon";
  coordinates: Position[][][];
}

export interface GeometryCollection<G extends Geometry = Geometry> extends GeoJsonObject {
  type: "GeometryCollection";
  geometries: G[];
}

export type GeoJsonProperties = { [name: string]: any } | null;

export interface Feature<G extends Geometry | null = Geometry, P = GeoJsonProperties> extends GeoJsonObject {
  type: "Feature";
  geometry: G;
  id?: string | number | undefined;
  properties: P;
}

export interface FeatureCollection<G extends Geometry | null = Geometry, P = GeoJsonProperties> extends GeoJsonObject {
  type: "FeatureCollection";
  features: Array<Feature<G, P>>;
}