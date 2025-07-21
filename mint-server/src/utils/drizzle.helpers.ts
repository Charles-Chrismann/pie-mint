import { race_start_waves_table, races_table, user_profiles_table, users_table } from "src/db/schema";

export const JoinedUser = {
  id: user_profiles_table.id,
  firstname: user_profiles_table.firstname,
  lastname: user_profiles_table.lastname,
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
