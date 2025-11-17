export interface JWTUser {
  userId: number;
  technicalId: number
  email: string
}

export interface DBOrganization {
  id: number
  name: string
  media_avatar_id: number
  media_banner_id: number
  created_by_id: number
  owner_id: number
}