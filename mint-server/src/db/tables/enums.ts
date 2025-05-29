import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const action_levels_table = pgTable("action_levels", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name"),
});