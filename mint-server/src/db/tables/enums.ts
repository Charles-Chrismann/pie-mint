import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

// Those tables are not supposed to be changed by any user

export const action_levels_table = pgTable("action_levels", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 256 }),
});

export const race_discipline_categories_table = pgTable("race_discipline_categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 256 }),
});

export const race_disciplines_table = pgTable("race_discipline", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 256 }),
  race_discipline_category_id: integer('race_discipline_category_id').notNull().references(() => race_discipline_categories_table.id)
});