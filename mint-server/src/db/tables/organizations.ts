import { AnyPgColumn, boolean, date, foreignKey, integer, pgTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { user_profiles_table } from "./users";
import { medias_table } from "./medias";
import { groups_table } from "./controls";

export const organizations_table = pgTable("organizations", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),

  name: varchar("name").notNull(),
  
  media_avatar_id: integer("media_avatar_id").references(() :AnyPgColumn => medias_table.id),
  media_banner_id: integer("media_banner_id").references(() :AnyPgColumn => medias_table.id),
  created_by_id: integer("created_by_id").notNull().references(() :AnyPgColumn => user_profiles_table.id),
  owner_id: integer("owner_id").notNull().references(() :AnyPgColumn => user_profiles_table.id),
});

export const organizations__groups_table = pgTable("organizations__groups", {
  organization_id: integer("organization_id").notNull().references(() :AnyPgColumn => organizations_table.id),
  group_id: integer("group_id").notNull().references(() :AnyPgColumn => groups_table.id),
}, (table) => [
  primaryKey({ name: 'pk_organizations__groups', columns: [table.organization_id, table.group_id] }),
]);

export const event_campaigns_table = pgTable("event_campaigns", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),

  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
});

export const events_table = pgTable("events", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),

  name: varchar("name"),
  description: varchar("description"),
  start_date: timestamp("start_date"),
  end_date: timestamp("end_date"),
  
  // TODO: add created_by
  event_campaign_id: integer("event_campaign_id").references(() :AnyPgColumn => event_campaigns_table.id),
  organization_id: integer("organization_id").notNull().references(() :AnyPgColumn => organizations_table.id),
});
