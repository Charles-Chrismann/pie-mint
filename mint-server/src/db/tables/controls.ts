import { boolean, integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { action_levels_table } from "./enums";
import { user_profiles_table, users_table } from "./users";

export const permissions_table = pgTable("permissions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  
  name: varchar("name"),
  action_level_id: integer("action_level_id").references(() => action_levels_table.id),
});

export const roles_table = pgTable("roles_table", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  
  name: varchar("name"),
  is_system: boolean("is_system"),
  created_at: timestamp("created_at"),

  created_by_id: integer("created_by_id").references(() => users_table.id),
});

export const roles__permissions_table = pgTable("roles__permissions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  
  role_id: integer("role_id").references(() => roles_table.id),
  permission_id: integer("permission_id").references(() => permissions_table.id),
});

export const group_utilities_table = pgTable("group_utilities", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name"),
});

export const groups_table = pgTable("groups", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name"),
  is_single_permision_group: boolean("is_single_permision_group"),
  is_system: boolean("is_system"),
  is_administration_group: boolean("is_administration_group"),
  is_member_group: boolean("is_member_group"),

  group_utility_id: integer("group_utility_id").references(() => group_utilities_table.id),
});

export const groups__permissions_table = pgTable("groups__permissions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  
  group_id: integer("group_id").references(() => groups_table.id),
  permission_id: integer("permission_id").references(() => permissions_table.id),
});

export const groups__roles_table = pgTable("groups__roles", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  
  group_id: integer("group_id").references(() => groups_table.id),
  role_id: integer("permission_id").references(() => roles_table.id),
});

export const groups__user_profiles_table = pgTable("groups__user_profiles", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  
  group_id: integer("group_id").references(() => groups_table.id),
  user_profile_id: integer("user_profile_id").references(() => user_profiles_table.id),
});