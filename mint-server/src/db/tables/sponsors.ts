import { integer, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { user_profiles_table } from "./users";
import { medias_table } from "./medias";
import { events_table, organizations_table } from "./organizations";

export const sponsors_table = pgTable("sponsors", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  name: varchar("name"),
  
  media_avatar_id: integer("media_avatar_id").notNull().references(() => medias_table.id),
  media_banner_id: integer("media_banner_id").notNull().references(() => medias_table.id),
  created_by_id: integer("created_by_id").notNull().references(() => user_profiles_table.id),
  owner_id: integer("owner_id").notNull().references(() => user_profiles_table.id),
});

export const sponsors__user_profiles_table = pgTable("sponsors__user_profiles", {
  sponsor_id: integer("sponsor_id").notNull().references(() => sponsors_table.id),
  user_profile_id: integer("user_profile_id").notNull().references(() => user_profiles_table.id),
}, (table) => [
  primaryKey({ name: 'pk_sponsors__user_profiles', columns: [table.sponsor_id, table.user_profile_id] }),
]);

export const sponsors__events_table = pgTable("sponsors__events", {
  sponsor_id: integer("sponsor_id").notNull().references(() => sponsors_table.id),
  event_id: integer("event_id").notNull().references(() => events_table.id),
}, (table) => [
  primaryKey({ name: 'pk_sponsors__events', columns: [table.sponsor_id, table.event_id] }),
]);

export const sponsors__organizations_table = pgTable("sponsors__organizations", {
  sponsor_id: integer("sponsor_id").notNull().references(() => sponsors_table.id),
  organization_id: integer("organization_id").notNull().references(() => organizations_table.id),
}, (table) => [
  primaryKey({ name: 'pk_sponsors__organizations', columns: [table.sponsor_id, table.organization_id] }),
]);
