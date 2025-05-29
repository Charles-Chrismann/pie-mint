import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { users_table } from "./users";
import { medias_table } from "./medias";

export const sponsors_table = pgTable("sponsors", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  name: varchar("name"),
  
  media_avatar_id: integer("media_avatar_id").notNull().references(() => medias_table.id),
  media_banner_id: integer("media_banner_id").notNull().references(() => medias_table.id),
  created_by_id: integer("created_by_id").notNull().references(() => users_table.id),
  owner_id: integer("owner_id").notNull().references(() => users_table.id),
});