import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { events_table, groups_table, organizations_table, races_table } from "../schema";
import { user_profiles_table } from "./users";
import { medias_table } from "./medias";

export const social_platforms_table = pgTable("social_platforms", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name").notNull().unique(),
  
  media_icon_id: integer("media_icon_id").references(() => medias_table.id),
});

export const profile_links_table = pgTable("profile_links", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  url: varchar("url"),
  
  social_platform_id: integer("social_platform_id").references(() => social_platforms_table.id),
  user_profile_id: integer("user_profile_id").references(() => user_profiles_table.id),
  organization_id: integer("organization_id").references(() =>organizations_table.id),
  event_id: integer("event_id").references(() => events_table.id),
  race_id: integer("race_id").references(() => races_table.id),
});