import { boolean, integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { action_levels_table } from "./enums";
import { user_profiles_table } from "./users";
import { sponsors_table } from "./sponsors";
import { organizations_table } from "./organizations";
import { events_table, sub_events_table } from "../schema";

export const setting_categories_table = pgTable("setting_categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  is_global: boolean('is_global'),
  name_key: varchar("name_key"),
  description_key: varchar("description_key"),

  action_level_id: integer("action_level_id").notNull().references(() => action_levels_table.id),
});

export const setting_types_table = pgTable("setting_types", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name"),
});

export const setting_multiple_options_table = pgTable("setting_multiple_options", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  value_key: varchar("value_key"),
  selected_by_default: boolean("selected_by_default"),

  setting_key_id: integer("setting_key_id").notNull().references(() => setting_keys_table.id),
});

export const setting_selected_options_table = pgTable("setting_selected_options", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  setting_multiple_option_id: integer("setting_multiple_option_id").notNull().references(() => setting_multiple_options_table.id),
  user_setting_id: integer("setting_key_id").notNull().references(() => user_profiles_table.id),
});

export const setting_keys_table = pgTable("setting_keys", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  label_key: varchar("label_key"),
  description_key: varchar("description_key"),
  default_value: varchar("default_value"),

  setting_category_id: integer("setting_category_id").notNull().references(() => setting_categories_table.id),
  setting_type_id: integer("setting_type_id").notNull().references(() => setting_types_table.id),
});

export const custom_settings_table = pgTable("custom_settings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  value: varchar("value"),

  user_profile_id: integer("user_profile_id").notNull().references(() => user_profiles_table.id),
  sponsor_id: integer("sponsor_id").notNull().references(() => sponsors_table.id),
  organization_id: integer("organization_id").notNull().references(() => organizations_table.id),
  event_id: integer("event_id").notNull().references(() => events_table.id),
  sub_event_id: integer("sub_event_id").notNull().references(() => sub_events_table.id),
});
