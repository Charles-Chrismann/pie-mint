import { boolean, doublePrecision, foreignKey, geometry, integer, numeric, pgTable, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";
import { events_table } from "./organizations";
import { user_profiles_table } from "./users";

export const standard_distances_table = pgTable("standard_distances", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name"),
  distance: numeric("distance", { precision: 10, scale: 3 }),
});

export const tracks_table = pgTable("tracks", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  name: varchar("name"),
});

export const track_points_table = pgTable("track_points", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  // in_track_id: integer("in_track_id").notNull(),

  // point: geometry('point', {type: "point", srid: 4326}),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  alt: doublePrecision("alt"),
  is_first_point: boolean('is_first_point').notNull(),
  is_last_point: boolean('is_last_point').notNull(),

  track_id: integer("track_id").notNull(),
  // in_track_previous_id: integer("in_track_previous_id"),
}, 
// (table) => [
//   primaryKey({
//     columns: [
//       table.track_id,
//       table.in_track_id
//     ],
//   }),
//   foreignKey({
//     columns: [table.track_id, table.in_track_previous_id],
//     foreignColumns: [table.track_id, table.in_track_id],
//   })
// ]
);

export const track_segments_table = pgTable("track_segments", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  
  track_id: integer("track_id").references(() => tracks_table.id),
  start_position_id: integer("start_position_id").references(() => track_points_table.id),
  end_position_id: integer("end_position_id").references(() => track_points_table.id),
})

export const sub_events_table = pgTable("sub_events", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  name: varchar("name").notNull(),
  start_time: timestamp("start_time").notNull(),
  distance: numeric("distance", { precision: 10, scale: 3 }),
  positiveElevation: numeric("positive_elevation", { precision: 10, scale: 3 }),

  event_id: integer("event_id").notNull().references(() => events_table.id),
  standard_distance_id: integer("standard_distance_id").references(() => standard_distances_table.id),
  track_id: integer("track_id").references(() => tracks_table.id),
});

export const sub_event_positions_table = pgTable("sub_event_positions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  created_at: timestamp("created_at"),

  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  alt: doublePrecision("alt"),

  user_profile_id: integer("user_profile_id").notNull().references(() => user_profiles_table.id),
  registration_id: integer("sub_event_id").references(() => registrations_table.id),
});

export const sub_event_start_waves_table = pgTable("sub_event_start_waves", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  start_time: timestamp('start_time').notNull(),

  sub_event_id: integer("sub_event_id").notNull().references(() => sub_events_table.id),
});

export const registrations_table = pgTable("registrations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  is_private: boolean("is_private"),
  bib_number: integer("bib_number"),
  bib_alias: integer("bib_alias"),

  user_profile_id: integer("user_profile_id").notNull().references(() => user_profiles_table.id),
  sub_event_id: integer("sub_event_id").references(() => sub_events_table.id),
  sub_event_start_wave_id: integer("sub_event_start_wave_id").references(() => sub_event_start_waves_table.id)
});

export const time_barriers_table = pgTable("time_barriers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  name: varchar("name").notNull(),
  is_end: boolean("is_end"),

  sub_event_id: integer("sub_event_id").references(() => sub_events_table.id),

  track_id: integer("position_id").notNull(),
  position_id: integer("position_id").notNull(),
}
// , (table) => [
//   foreignKey({
//     columns: [table.track_id, table.position_id],
//     foreignColumns: [track_points_table.track_id, track_points_table.in_track_id],
//   })
// ]
);