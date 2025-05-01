import { timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}