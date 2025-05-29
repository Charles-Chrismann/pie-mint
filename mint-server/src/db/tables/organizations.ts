import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { users_table } from "./users";
import { medias_table } from "./medias";

export const organizations_table = pgTable("organizations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  name: varchar("name"),
  
  media_avatar_id: integer("media_avatar_id").notNull().references(() => medias_table.id),
  media_banner_id: integer("media_banner_id").notNull().references(() => medias_table.id),
  created_by_id: integer("created_by_id").notNull().references(() => users_table.id),
  owner_id: integer("owner_id").notNull().references(() => users_table.id),
});

export const events_table = pgTable("events", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  name: varchar("name"),
  description: varchar("description"),
  start_date: timestamp("start_date"),
  end_date: timestamp("end_date"),
  
  organization_id: integer("organization_id").notNull().references(() => organizations_table.id),
});
