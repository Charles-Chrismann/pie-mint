import { alias, SelectedFields } from "drizzle-orm/pg-core";
import { countries_table, medias_table, race_start_waves_table, races_table, user_profiles_table, users_table } from "..";

const banner_medias_table = alias(medias_table, "banner_medias_table");

export const JoinedUser = {
  id: user_profiles_table.user_id,
  firstname: user_profiles_table.firstname,
  lastname: user_profiles_table.lastname,
  avatar_media_id: user_profiles_table.avatar_media_id,
  avatar_url: medias_table.url,
  banner_media_id: user_profiles_table.banner_media_id,
  banner_url: banner_medias_table.url,
}

export const JoinedRace = {
  id: races_table.id,
  name: races_table.name,
  start_date: races_table.start_date,
  distance: races_table.distance,
  positive_elevation: races_table.positive_elevation,
}

export const JoinedStartWave = {
  id: race_start_waves_table.id,
  name: race_start_waves_table.name,
  start_date: race_start_waves_table.start_time,
  wave_index: race_start_waves_table.wave_index,
  is_elite: race_start_waves_table.is_elite,
}
