import { boolean, date, integer, pgTable, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";
import { user_profiles_table } from "./users";
import { medias_table } from "./medias";
import { groups_table } from "./controls";

export const organizations_table = pgTable("organizations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  name: varchar("name").notNull(),
  is_auto_generated: boolean("is_auto_generated").default(false),
  
  media_avatar_id: integer("media_avatar_id").references(() => medias_table.id),
  media_banner_id: integer("media_banner_id").references(() => medias_table.id),
  created_by_id: integer("created_by_id").notNull().references(() => user_profiles_table.id),
  owner_id: integer("owner_id").notNull().references(() => user_profiles_table.id),
});

export const organizations__groups_table = pgTable("organizations__groups", {
  organization_id: integer("organization_id").notNull().references(() => organizations_table.id),
  group_id: integer("group_id").notNull().references(() => groups_table.id),
}, (table) => [
  primaryKey({ name: 'pk_organizations__groups', columns: [table.organization_id, table.group_id] }),
]);

export const events_table = pgTable("events", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  name: varchar("name"),
  is_auto_generated: boolean("is_auto_generated").default(false),
  description: varchar("description"),
  start_date: timestamp("start_date"),
  end_date: timestamp("end_date"),
  
  organization_id: integer("organization_id").notNull().references(() => organizations_table.id),
});
