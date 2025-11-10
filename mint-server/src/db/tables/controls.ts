import { AnyPgColumn, boolean, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { action_levels_table } from "./enums";
import { user_profiles_table } from "./users";

export const permissions_table = pgTable("permissions", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  
  name: varchar("name"),
  description: text("description"),
  name_key:  varchar("name_key"),
  description_key: varchar("description_key"),
  
  action_level_id: integer("action_level_id").references((): AnyPgColumn => action_levels_table.id),
});

export const roles_table = pgTable("roles", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  
  name: varchar("name"),
  is_system: boolean("is_system"),
  created_at: timestamp("created_at"),

  created_by_id: integer("created_by_id").references((): AnyPgColumn => user_profiles_table.user_id),
});

export const roles__permissions_table = pgTable("roles__permissions", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  
  role_id: integer("role_id").references((): AnyPgColumn => roles_table.id),
  permission_id: integer("permission_id").references((): AnyPgColumn => permissions_table.id),
});

export const groups_table = pgTable("groups", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name"),
  is_single_permision_group: boolean("is_single_permision_group"),
  is_system: boolean("is_system"),
  is_administration_group: boolean("is_administration_group"),
  is_member_group: boolean("is_member_group"),

  action_level_id: integer("action_level_id").references((): AnyPgColumn => action_levels_table.id),
});

export const groups__permissions_table = pgTable("groups__permissions", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  
  group_id: integer("group_id").references((): AnyPgColumn => groups_table.id),
  permission_id: integer("permission_id").references((): AnyPgColumn => permissions_table.id),
});

export const groups__roles_table = pgTable("groups__roles", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  
  group_id: integer("group_id").references((): AnyPgColumn => groups_table.id),
  role_id: integer("permission_id").references((): AnyPgColumn => roles_table.id),
});

export const groups__user_profiles_table = pgTable("groups__user_profiles", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  
  group_id: integer("group_id").references((): AnyPgColumn => groups_table.id),
  user_profile_id: integer("user_profile_id").references((): AnyPgColumn => user_profiles_table.user_id),
});