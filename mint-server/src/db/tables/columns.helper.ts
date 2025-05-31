import { integer, timestamp } from "drizzle-orm/pg-core";
import { user_profiles_table, users_table } from "./users";

export const timestamps = {
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

export const userRelated = {
  createdById: integer('created_by_id').references(() => user_profiles_table.id),
  ownerId: integer('owner_id').references(() => user_profiles_table.id),
}