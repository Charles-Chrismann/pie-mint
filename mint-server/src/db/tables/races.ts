import { AnyPgColumn, boolean, check, customType, doublePrecision, foreignKey, integer, numeric, pgTable, primaryKey, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { events_table, organizations_table } from "./organizations";
import { user_profiles_table } from "./users";
import { sql } from "drizzle-orm";
import { race_disciplines_table, standard_distances_table } from "./enums";


export const tracks_table = pgTable("tracks", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),

  name: varchar("name"),
});

// export const track_points_table = pgTable("track_points", {
//   id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
//   // in_track_id: integer("in_track_id").notNull(),

//   // point: geometry('point', {type: "point", srid: 4326}),
//   // lat: doublePrecision("lat"),
//   // lng: doublePrecision("lng"),
//   // alt: doublePrecision("alt"),
//   location: geometry('location', { type: 'point', srid: 4326 }).notNull(),
//   is_first_point: boolean('is_first_point').notNull(),
//   is_last_point: boolean('is_last_point').notNull(),

//   track_id: integer("track_id").notNull(),
//   // in_track_previous_id: integer("in_track_previous_id"),
// }, 
// // (table) => [
// //   primaryKey({
// //     columns: [
// //       table.track_id,
// //       table.in_track_id
// //     ],
// //   }),
// //   foreignKey({
// //     columns: [table.track_id, table.in_track_previous_id],
// //     foreignColumns: [table.track_id, table.in_track_id],
// //   })
// // ]
// );

const geometry = customType<{
  data: string;
  driverData: string;
}>({
  dataType() {
    return 'geometry(LINESTRINGZ,4326)';
  },
});

export const track_segments_table = pgTable("track_segments", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),

  track_id: integer("track_id").references((): AnyPgColumn => tracks_table.id),
  // segment: geometry('pointz', {type: "pointz", srid: 4326})
  segment: geometry('segment').notNull(),
  segment_index: integer('segment_index').notNull(),
  // start_position_id: integer("start_position_id").references((): AnyPgColumn => track_points_table.id),
  // end_position_id: integer("end_position_id").references((): AnyPgColumn => track_points_table.id),
})

export const races_table = pgTable("races", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),

  name: varchar("name").notNull(),
  start_date: timestamp("start_date").notNull(),
  end_date: timestamp("end_date"),
  distance: numeric("distance", { precision: 10, scale: 3 }),
  positive_elevation: numeric("positive_elevation", { precision: 10, scale: 3 }),

  standard_distance_id: integer("standard_distance_id").references((): AnyPgColumn => standard_distances_table.id),
  track_id: integer("track_id").references((): AnyPgColumn => tracks_table.id),
  race_discipline_id: integer("race_discipline_id").references((): AnyPgColumn => race_disciplines_table.id),

  //If a race is in an event, in wich case the property organization_id should be defined
  event_id: integer("event_id").references((): AnyPgColumn => events_table.id),
  organization_id: integer("organization_id").references((): AnyPgColumn => organizations_table.id),

  // If a race is owned by a user, event_id && organization_id should be null
  created_by_id: integer("created_by_id").notNull().references((): AnyPgColumn => user_profiles_table.id),
  owner_id: integer("owner_id").references((): AnyPgColumn => user_profiles_table.id),
},
  (table) => [
    check("event_requires_org", sql`
      ${table.event_id} IS NULL OR ${table.organization_id} IS NOT NULL
    `),
    check("owner_must_be_alone", sql`
      ${table.owner_id} IS NULL OR 
      (${table.event_id} IS NULL AND ${table.organization_id} IS NULL)
    `),
    check("distance_and_standard_distance_should_not_be_defined_at_the_same_time", sql`
      ${table.distance} IS NULL OR ${table.standard_distance_id} IS NULL
    `),
  ]
);

export const race_positions_table = pgTable("race_positions", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  created_at: timestamp("created_at"),

  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  alt: doublePrecision("alt"),

  user_profile_id: integer("user_profile_id").notNull().references((): AnyPgColumn => user_profiles_table.id),
  registration_id: integer("race_id").references((): AnyPgColumn => registrations_table.id),
});

export const race_start_waves_table = pgTable("race_start_waves", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),

  name: varchar("name"),
  start_time: timestamp('start_time').notNull(),
  wave_index: integer("wave_index").notNull(),
  is_elite: boolean("is_elite").notNull(),

  race_id: integer("race_id").notNull().references((): AnyPgColumn => races_table.id),
});

export const registrations_table = pgTable("registrations", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),

  is_accepted: boolean("is_accepted").default(false),
  is_private: boolean("is_private"),
  bib_number: integer("bib_number"),
  bib_alias: varchar("bib_alias"),

  user_profile_id: integer("user_profile_id").notNull().references((): AnyPgColumn => user_profiles_table.id),
  race_id: integer("race_id").notNull().references((): AnyPgColumn => races_table.id),
  race_start_wave_id: integer("race_start_wave_id").references((): AnyPgColumn => race_start_waves_table.id)
});

export const time_barriers_table = pgTable("time_barriers", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),

  name: varchar("name").notNull(),
  is_end: boolean("is_end"),

  race_id: integer("race_id").references((): AnyPgColumn => races_table.id),

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