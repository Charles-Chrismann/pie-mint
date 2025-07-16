import { boolean, integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { action_levels_table } from "./enums";
import { user_profiles_table } from "./users";
import { events_table, organizations_table } from "./organizations";
import { races_table } from "./races";

export const media_contexts_table = pgTable("media_contexts", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  
  name: varchar("name").notNull().unique(),
});

export const media_formats_table = pgTable("media_formats", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  
  name: varchar("name").notNull().unique(),
});

export const media_types_table = pgTable("media_types", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  
  name: varchar("name").notNull().unique(),
  mime_type: varchar("mime_type"),

  media_format_id: integer("media_format_id").notNull().references(() => media_formats_table.id),
});

export const medias_table = pgTable("medias", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  
  url: varchar("url"),
  is_system: boolean("is_system"),

  media_type_id: integer("media_type_id").notNull().references(() => media_types_table.id),
  media_context_id: integer("media_context_id").notNull().references(() => media_contexts_table.id),
  user_profile_id: integer("user_profile_id").notNull().references(() => user_profiles_table.id),
  organization_id: integer("organization_id").notNull().references(() => organizations_table.id),
  event_id: integer("event_id").notNull().references(() => events_table.id),
  race_id: integer("race_id").notNull().references(() => races_table.id),
});