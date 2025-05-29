import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const countries_table = pgTable("countries", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  
  french_translation: varchar("french_translation"),
  english_translation: varchar("english_translation"),
  self_translation: varchar("self_translation"),
  flag_emoji: varchar("flag_emoji"),
});

export const languages_table = pgTable("languages", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  
  french_translation: varchar("french_translation"),
  english_translation: varchar("english_translation"),
  self_translation: varchar("self_translation"),
  bcp47: varchar("bcp47"),

  country_id: integer("country_id").notNull().references(() => countries_table.id),
});

export const translations_table = pgTable("translations", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  
  key: varchar("key"),
  value: varchar("value"),

  language_id: integer("language_id").notNull().references(() => languages_table.id),
});