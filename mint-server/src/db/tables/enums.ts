import { integer, numeric, pgTable, unique, uniqueIndex, varchar } from "drizzle-orm/pg-core";

// Those tables are not supposed to be changed by any user

export const action_levels_table = pgTable("action_levels", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 256 }).notNull().unique(),
});

export const race_discipline_categories_table = pgTable("race_discipline_categories", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 256 }).notNull().unique(),
});

export const race_disciplines_table = pgTable(
  "race_discipline",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }).notNull(),

    race_discipline_category_id: integer("race_discipline_category_id")
      .notNull()
      .references(() => race_discipline_categories_table.id),
  },
  (table) => ({
    uniqueNameCategory: unique().on(table.name, table.race_discipline_category_id),
  })
);

export const standard_distances_table = pgTable("standard_distances", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name").notNull().unique(),
  distance: numeric("distance", { precision: 10, scale: 3 }).notNull(),
});