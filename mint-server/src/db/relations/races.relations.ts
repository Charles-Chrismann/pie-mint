import { relations } from "drizzle-orm";
import { races_table, registrations_table, track_segments_table, tracks_table } from "../tables/races";
import { user_profiles_table } from "../tables/users";

export const racesRelations = relations(races_table, ({ one, many }) => ({

  registrations: many(registrations_table),

  track: one(tracks_table, {
    fields: [races_table.track_id],
    references: [tracks_table.id]
  }),
}));

export const registrationsRelations = relations(registrations_table, ({ one }) => ({

  user_profile: one(user_profiles_table, {
    fields: [registrations_table.user_profile_id],
    references: [user_profiles_table.id]
  }),

  race: one(races_table, {
    fields: [registrations_table.race_id],
    references: [races_table.id]
  }),
}));

export const tracksRelations = relations(tracks_table, ({ one, many }) => ({
  race: one(races_table),

  segments: many(track_segments_table)
}))

export const trackSegmentsRelations = relations(track_segments_table, ({ one, many }) => ({
  track: one(tracks_table, {
    fields: [track_segments_table.track_id],
    references: [tracks_table.id]
  }),
}))