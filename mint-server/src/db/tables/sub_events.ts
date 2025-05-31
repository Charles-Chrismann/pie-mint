import { boolean, doublePrecision, geometry, integer, numeric, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
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

  // point: geometry('point', {type: "point", srid: 4326}),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  alt: doublePrecision("alt"),
  
  track_id: integer("track_id").notNull().references(() => tracks_table.id),
});

export const sub_events_table = pgTable("sub_events", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  name: varchar("name"),
  distance: numeric("distance", { precision: 10, scale: 3 }),
  positiveElevation: numeric("positive_elevation", { precision: 10, scale: 3 }),
  
  event_id: integer("event_id").notNull().references(() => events_table.id),
  standard_distance_id: integer("standard_distance_id").references(() => standard_distances_table.id),
  track_id: integer("track_id").references(() => tracks_table.id),
});

export const registrations_table = pgTable("registrations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  is_private: boolean("is_private"),
  bib_number: integer("bib_number"),
  bib_alias: integer("bib_alias"),
  
  user_profile_id: integer("user_profile_id").notNull().references(() => user_profiles_table.id),
  sub_event_id: integer("sub_event_id").references(() => sub_events_table.id),
});

export const positions_table = pgTable("track_points", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  created_at: timestamp("created_at"),

  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  alt: doublePrecision("alt"),
  
  user_profile_id: integer("user_profile_id").notNull().references(() => user_profiles_table.id),
  registration_id: integer("sub_event_id").references(() => registrations_table.id),
});