import { AnyPgColumn, boolean, integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { user_profiles_table } from "./users";
import { medias_table } from "./medias";
import { organizations_table } from "./organizations";

export const badges_table = pgTable("badges", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  
  name_key: varchar("name_key"),
  description_key: varchar("description_key"),
  is_leveled: boolean("is_leveled"),

  media_id: integer("media_id").notNull().references((): AnyPgColumn => medias_table.id),
  user_profile_id: integer("user_profile_id").notNull().references((): AnyPgColumn => user_profiles_table.id),
  organization_id: integer("organization_id").notNull().references((): AnyPgColumn => organizations_table.id),
});

export const badge_levels_table = pgTable("badge_levels", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  
  level: integer("level"),
  description_key: varchar("description_key"),
  start: integer("start"),
  end: integer("end"),

  badge_id: integer("badge_id").notNull().references((): AnyPgColumn => badges_table.id),
});

export const badge_progressions_table = pgTable("badge_progressions", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  
  progress: integer("progress"),
  completed_at: timestamp("completed_at"),

  badge_id: integer("badge_id").notNull().references((): AnyPgColumn => badges_table.id),
  badge_level_id: integer("badge_id").references((): AnyPgColumn => badge_levels_table.id),
  user_profile_id: integer("badge_id").notNull().references((): AnyPgColumn => user_profiles_table.id),
});
