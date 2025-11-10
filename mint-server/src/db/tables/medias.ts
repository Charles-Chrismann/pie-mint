import { AnyPgColumn, boolean, integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { action_levels_table, media_context_enum } from "./enums";
import { user_profiles_table } from "./users";
import { events_table, organizations_table } from "./organizations";
import { races_table } from "./races";

export const media_contexts_table = pgTable("media_contexts", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  
  name: varchar("name").notNull().unique(),
});

export const media_types_table = pgTable("media_types", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  
  name: varchar("name").notNull().unique(),
  mime_type: varchar("mime_type"),
});

export const medias_table = pgTable("medias", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  
  url: varchar({ length: 255 }),
  is_system: boolean("is_system").default(false),

  media_type_id: integer("media_type_id")
    .notNull()
    .references((): AnyPgColumn => media_types_table.id),
  media_context: media_context_enum()
    .notNull(),
  created_by_id: integer().references((): AnyPgColumn => user_profiles_table.user_id),
  organization_id: integer("organization_id").references((): AnyPgColumn => organizations_table.id),
  event_id: integer("event_id").references((): AnyPgColumn => events_table.id),
  race_id: integer("race_id").references((): AnyPgColumn => races_table.id),
});