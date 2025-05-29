import { integer, timestamp } from "drizzle-orm/pg-core";
import { users_table } from "./schema";

export const timestamps = {
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

export const userRelated = {
  createdById: integer('created_by_id').references(() => users_table.id),
  ownerId: integer('owner_id').references(() => users_table.id),
}