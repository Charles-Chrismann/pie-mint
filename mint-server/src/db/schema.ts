export { users_table } from "./tables/users"
export { user_profiles_table } from "./tables/users"

export { organizations_table } from "./tables/organizations"
export { organizations__groups_table } from "./tables/organizations"
export { events_table } from "./tables/organizations"

export { sponsors_table } from "./tables/sponsors"

export { standard_distances_table } from "./tables/sub_events"
export { tracks_table } from "./tables/sub_events"
export { track_points_table } from "./tables/sub_events"
export { track_segments_table } from "./tables/sub_events"
export { sub_events_table } from "./tables/sub_events"
export { registrations_table } from "./tables/sub_events"
export { positions_table } from "./tables/sub_events"
export { time_barriers_table } from "./tables/sub_events"

export { permissions_table } from "./tables/controls"
export { roles_table } from "./tables/controls"
export { roles__permissions_table } from "./tables/controls"
export { groups_table } from "./tables/controls"
export { groups__permissions_table } from "./tables/controls"
export { groups__roles_table } from "./tables/controls"
export { groups__user_profiles_table } from "./tables/controls"

export { countries_table } from "./tables/translations"
export { languages_table } from "./tables/translations"
export { translations_table } from "./tables/translations"

export { media_contexts_table } from "./tables/medias"
export { media_formats_table } from "./tables/medias"
export { media_types_table } from "./tables/medias"
export { medias_table } from "./tables/medias"

export { setting_categories_table } from "./tables/settings"
export { setting_types_table } from "./tables/settings"
export { setting_multiple_options_table } from "./tables/settings"
export { setting_selected_options_table } from "./tables/settings"
export { setting_keys_table } from "./tables/settings"
export { custom_settings_table } from "./tables/settings"

export { social_platforms_table } from "./tables/profile_links"
export { profile_links_table } from "./tables/profile_links"

export { badges_table } from "./tables/badges"
export { badge_levels_table } from "./tables/badges"
export { badge_progressions_table } from "./tables/badges"

export { action_levels_table } from "./tables/enums"

// export const track_points_table = pgTable("tracks", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

//   point: geometry({ type: "pointz" }),
// });



// export const social_platforms_table = pgTable("social_platforms", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   name: varchar("name"),
//   icon_url: varchar("icon_url"),
// });

// export const user_profile_links_table = pgTable("user_profile_links", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   url: varchar("url"),
//   social_platform_id: integer("social_platform_id").references(() => social_platforms_table.id),
//   user_profile_id: integer("user_profile_id").references(() => user_profiles_table.id),
// });

// export const setting_keys_table = pgTable("setting_keys", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   key: varchar("key"),
//   label: varchar("label"),
//   type: varchar("type"),
//   default_value: varchar("default_value"),
//   description: varchar("description"),
//   category_id: integer("category_id").references(() => setting_categories_table.id),
//   setting_type_id: integer("setting_type_id").notNull().references(() => setting_type_table.id),
// });

// export const setting_multiple_options_table = pgTable("setting_multiple_options", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   value: varchar("value").notNull(),
//   selected_by_default: boolean("selected_by_default"),
//   setting_key_id: integer("setting_key_id").notNull().references(() => setting_keys_table.id),
// });

// export const setting_selected_options_table = pgTable("setting_selected_options", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   setting_multiple_option_id: integer("setting_multiple_option_id").notNull().references(() => setting_multiple_options_table.id),
//   user_setting_id: integer("user_setting_id").notNull().references(() => user_settings_table.id),
// });

// export const user_settings_table = pgTable("user_settings", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   user_profile_id: integer("user_profile_id").notNull().references(() => user_profiles_table.id),
//   key_id: integer("key_id").notNull().references(() => setting_keys_table.id),
//   value: varchar("value"),
// });

// export const sponsors_table = pgTable("sponsors", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
// });

// export const sponsor_links_table = pgTable("sponsor_links", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   url: varchar("url"),
//   social_platform_id: integer("social_platform_id").references(() => social_platforms_table.id),
//   sponsor_id: integer("sponsor_id").references(() => sponsors_table.id),
// });

// export const organizations_table = pgTable("organizations", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   name: varchar("name"),
//   avatar_url: varchar("avatar_url"),
//   banner_url: varchar("banner_url"),
//   created_by_id: integer("created_by_id").notNull().references(() => user_profiles_table.id),
//   owner_id: integer("owner_id").notNull().references(() => user_profiles_table.id),
// });

// export const organization_links_table = pgTable("organization_links", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   url: varchar("url"),
//   social_platform_id: integer("social_platform_id").references(() => social_platforms_table.id),
//   organization_id: integer("organization_id").references(() => organizations_table.id),
// });

// export const groups_table = pgTable("groups", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   name: varchar("name"),
//   is_system: boolean("is_system"),
// });

// export const groups__user_profiles_table = pgTable("groups__user_profiles", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   group_id: integer("group_id").notNull().references(() => groups_table.id),
//   user_profile_id: integer("user_profile_id").notNull().references(() => user_profiles_table.id),
// });

// export const groups__roles_table = pgTable("groups__roles", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   group_id: integer("group_id").notNull().references(() => groups_table.id),
//   role_id: integer("role_id").notNull().references(() => roles_table.id),
// });

// export const roles_table = pgTable("roles", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   name: varchar("name"),
//   is_system: boolean("is_system"),
// });

// export const roles__permissions_table = pgTable("roles__permissions", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   role_id: integer("role_id").notNull().references(() => roles_table.id),
//   permission_id: integer("permission_id").notNull().references(() => permissions_table.id),
// });

// export const groupes__permissions_table = pgTable("groupes__permissions", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   group_id: integer("group_id").notNull().references(() => groups_table.id),
//   permission_id: integer("permission_id").notNull().references(() => permissions_table.id),
// });

// export const organizations__groups_table = pgTable("organizations__groups", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   is_member_group: boolean("is_member_group"),
//   organization_id: integer("organization_id").notNull().references(() => organizations_table.id),
//   group_id: integer("group_id").notNull().references(() => groups_table.id),
// });

// export const events_table = pgTable("events", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   organization_id: integer("organization_id").notNull().references(() => organizations_table.id),
//   name: varchar("name"),
//   description: varchar("description"),
//   start_date: date("start_date"),
//   end_date: date("end_date"),
// });

// export const event_links_table = pgTable("event_links", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   url: varchar("url"),
//   social_platform_id: integer("social_platform_id").references(() => social_platforms_table.id),
//   event_id: integer("event_id").references(() => events_table.id),
// });

// export const events__groups_table = pgTable("events__groups", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   is_member_group: boolean("is_member_group"),
//   event_id: integer("event_id").notNull().references(() => events_table.id),
//   group_id: integer("group_id").notNull().references(() => groups_table.id),
// });

// export const standard_distances_table = pgTable("standard_distances", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   name: varchar("name"),
//   distance: numeric("distance", { precision: 10, scale: 3 }),
// });

// export const sub_events_table = pgTable("sub_events", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   name: varchar("name"),
//   distance: numeric("distance", { precision: 10, scale: 3 }),
//   positiveElevation: numeric("positive_elevation", { precision: 10, scale: 3 }),
//   event_id: integer("event_id").notNull().references(() => events_table.id),
//   standard_distance_id: integer("standard_distance_id").references(() => standard_distances_table.id),
// });

// export const sub_events__groups_table = pgTable("sub_events__groups", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   is_member_group: boolean("is_member_group"),
//   sub_event_id: integer("sub_event_id").notNull().references(() => sub_events_table.id),
//   group_id: integer("group_id").notNull().references(() => groups_table.id),
// });

// export const registrations_table = pgTable("registrations", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   is_private: boolean("is_private"),
//   bib_number: varchar("bib_number"),
//   bib_alias: varchar("bib_alias"),
//   user_profile_id: integer("user_profile_id").notNull().references(() => user_profiles_table.id),
//   sub_event_id: integer("sub_event_id").notNull().references(() => sub_events_table.id),
// });

// export const sub_events__registrations_table = pgTable("sub_events__registrations", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   is_member_group: boolean("is_member_group"),
//   sub_event_id: integer("sub_event_id").notNull().references(() => sub_events_table.id),
//   registration_id: integer("registration_id").notNull().references(() => registrations_table.id),
// });

// export const permissions_table = pgTable("permissions", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   name: varchar("name"),
//   action_level_id: integer("action_level_id").notNull().references(() => action_levels_table.id),
// });


// Importe les tables au préalable (ex: import { users, user_profiles, organizations, ... } from './schema')

// export const usersRelations = relations(users, ({ one }) => ({
//   profile: one(user_profiles, {
//     fields: [users.id],
//     references: [user_profiles.user_id],
//   }),
// }));

// export const userProfilesRelations = relations(user_profiles, ({ one, many }) => ({
//   user: one(users, {
//     fields: [user_profiles.user_id],
//     references: [users.id],
//   }),
//   settings: many(user_settings),
//   createdOrganizations: many(organizations, {
//     relationName: 'createdOrganizations',
//     fields: [user_profiles.id],
//     references: [organizations.created_by_id],
//   }),
//   ownedOrganizations: many(organizations, {
//     relationName: 'ownedOrganizations',
//     fields: [user_profiles.id],
//     references: [organizations.owner_id],
//   }),
//   groups: many(groups__user_profiles),
//   registrations: many(registrations),
//   socialLinks: many(user_profile_links),
// }));

// export const userSettingsRelations = relations(user_settings, ({ one, many }) => ({
//   profile: one(user_profiles, {
//     fields: [user_settings.user_profile_id],
//     references: [user_profiles.id],
//   }),
//   settingKey: one(setting_keys, {
//     fields: [user_settings.key_id],
//     references: [setting_keys.id],
//   }),
//   selectedOptions: many(setting_selected_options),
// }));

// export const settingCategoriesRelations = relations(setting_categories, ({ many, one }) => ({
//   keys: many(setting_keys),
//   actionLevel: one(action_levels, {
//     fields: [setting_categories.action_level_id],
//     references: [action_levels.id],
//   }),
// }));

// export const settingKeysRelations = relations(setting_keys, ({ one, many }) => ({
//   category: one(setting_categories, {
//     fields: [setting_keys.category_id],
//     references: [setting_categories.id],
//   }),
//   type: one(setting_type, {
//     fields: [setting_keys.setting_type_id],
//     references: [setting_type.id],
//   }),
//   multipleOptions: many(setting_multiple_options),
//   userSettings: many(user_settings),
// }));

// export const settingMultipleOptionsRelations = relations(setting_multiple_options, ({ one, many }) => ({
//   settingKey: one(setting_keys, {
//     fields: [setting_multiple_options.setting_key_id],
//     references: [setting_keys.id],
//   }),
//   selectedOptions: many(setting_selected_options),
// }));

// export const settingSelectedOptionsRelations = relations(setting_selected_options, ({ one }) => ({
//   multipleOption: one(setting_multiple_options, {
//     fields: [setting_selected_options.setting_multiple_option_id],
//     references: [setting_multiple_options.id],
//   }),
//   userSetting: one(user_settings, {
//     fields: [setting_selected_options.user_setting_id],
//     references: [user_settings.id],
//   }),
// }));

// export const organizationsRelations = relations(organizations, ({ one, many }) => ({
//   createdBy: one(user_profiles, {
//     fields: [organizations.created_by_id],
//     references: [user_profiles.id],
//   }),
//   owner: one(user_profiles, {
//     fields: [organizations.owner_id],
//     references: [user_profiles.id],
//   }),
//   groups: many(organizations__groups),
//   events: many(events),
//   links: many(organization_links),
// }));

// export const groupsRelations = relations(groups, ({ many }) => ({
//   userProfiles: many(groups__user_profiles),
//   roles: many(groups__roles),
//   permissions: many(groupes__permissions),
//   organizationGroups: many(organizations__groups),
//   eventGroups: many(events__groups),
//   subEventGroups: many(sub_events__groups),
// }));

// export const groupsUserProfilesRelations = relations(groups__user_profiles, ({ one }) => ({
//   group: one(groups, {
//     fields: [groups__user_profiles.group_id],
//     references: [groups.id],
//   }),
//   profile: one(user_profiles, {
//     fields: [groups__user_profiles.user_profile_id],
//     references: [user_profiles.id],
//   }),
// }));

// export const groupsRolesRelations = relations(groups__roles, ({ one }) => ({
//   group: one(groups, {
//     fields: [groups__roles.group_id],
//     references: [groups.id],
//   }),
//   role: one(roles, {
//     fields: [groups__roles.role_id],
//     references: [roles.id],
//   }),
// }));

// export const rolesRelations = relations(roles, ({ many }) => ({
//   permissions: many(roles__permissions),
//   groups: many(groups__roles),
// }));

// export const rolesPermissionsRelations = relations(roles__permissions, ({ one }) => ({
//   role: one(roles, {
//     fields: [roles__permissions.role_id],
//     references: [roles.id],
//   }),
//   permission: one(permissions, {
//     fields: [roles__permissions.permission_id],
//     references: [permissions.id],
//   }),
// }));

// export const permissionsRelations = relations(permissions, ({ one, many }) => ({
//   actionLevel: one(action_levels, {
//     fields: [permissions.action_level_id],
//     references: [action_levels.id],
//   }),
//   roles: many(roles__permissions),
//   groups: many(groupes__permissions),
// }));

// export const groupesPermissionsRelations = relations(groupes__permissions, ({ one }) => ({
//   group: one(groups, {
//     fields: [groupes__permissions.group_id],
//     references: [groups.id],
//   }),
//   permission: one(permissions, {
//     fields: [groupes__permissions.permission_id],
//     references: [permissions.id],
//   }),
// }));

// export const organizationsGroupsRelations = relations(organizations__groups, ({ one }) => ({
//   organization: one(organizations, {
//     fields: [organizations__groups.organization_id],
//     references: [organizations.id],
//   }),
//   group: one(groups, {
//     fields: [organizations__groups.group_id],
//     references: [groups.id],
//   }),
// }));

// export const eventsRelations = relations(events, ({ one, many }) => ({
//   organization: one(organizations, {
//     fields: [events.organization_id],
//     references: [organizations.id],
//   }),
//   groups: many(events__groups),
//   subEvents: many(sub_events),
//   links: many(event_links),
// }));

// export const eventsGroupsRelations = relations(events__groups, ({ one }) => ({
//   event: one(events, {
//     fields: [events__groups.event_id],
//     references: [events.id],
//   }),
//   group: one(groups, {
//     fields: [events__groups.group_id],
//     references: [groups.id],
//   }),
// }));

// export const subEventsRelations = relations(sub_events, ({ one, many }) => ({
//   event: one(events, {
//     fields: [sub_events.event_id],
//     references: [events.id],
//   }),
//   standardDistance: one(standard_distances, {
//     fields: [sub_events.standard_distance_id],
//     references: [standard_distances.id],
//   }),
//   groups: many(sub_events__groups),
//   registrations: many(registrations),
// }));

// export const subEventsGroupsRelations = relations(sub_events__groups, ({ one }) => ({
//   subEvent: one(sub_events, {
//     fields: [sub_events__groups.sub_event_id],
//     references: [sub_events.id],
//   }),
//   group: one(groups, {
//     fields: [sub_events__groups.group_id],
//     references: [groups.id],
//   }),
// }));

// export const registrationsRelations = relations(registrations, ({ one, many }) => ({
//   profile: one(user_profiles, {
//     fields: [registrations.user_profile_id],
//     references: [user_profiles.id],
//   }),
//   subEvent: one(sub_events, {
//     fields: [registrations.sub_event_id],
//     references: [sub_events.id],
//   }),
//   subEventRegistrations: many(sub_events__registrations),
// }));

// export const subEventsRegistrationsRelations = relations(sub_events__registrations, ({ one }) => ({
//   subEvent: one(sub_events, {
//     fields: [sub_events__registrations.sub_event_id],
//     references: [sub_events.id],
//   }),
//   registration: one(registrations, {
//     fields: [sub_events__registrations.registration_id],
//     references: [registrations.id],
//   }),
// }));

// export const socialPlatformsRelations = relations(social_platforms, ({ many }) => ({
//   userLinks: many(user_profile_links),
//   organizationLinks: many(organization_links),
//   eventLinks: many(event_links),
//   sponsorLinks: many(sponsor_links),
// }));

// export const userProfileLinksRelations = relations(user_profile_links, ({ one }) => ({
//   socialPlatform: one(social_platforms, {
//     fields: [user_profile_links.social_platform_id],
//     references: [social_platforms.id],
//   }),
//   profile: one(user_profiles, {
//     fields: [user_profile_links.user_profile_id],
//     references: [user_profiles.id],
//   }),
// }));

// export const organizationLinksRelations = relations(organization_links, ({ one }) => ({
//   socialPlatform: one(social_platforms, {
//     fields: [organization_links.social_platform_id],
//     references: [social_platforms.id],
//   }),
//   organization: one(organizations, {
//     fields: [organization_links.organization_id],
//     references: [organizations.id],
//   }),
// }));

// export const eventLinksRelations = relations(event_links, ({ one }) => ({
//   socialPlatform: one(social_platforms, {
//     fields: [event_links.social_platform_id],
//     references: [social_platforms.id],
//   }),
//   event: one(events, {
//     fields: [event_links.event_id],
//     references: [events.id],
//   }),
// }));

// export const sponsorLinksRelations = relations(sponsor_links, ({ one }) => ({
//   socialPlatform: one(social_platforms, {
//     fields: [sponsor_links.social_platform_id],
//     references: [social_platforms.id],
//   }),
//   sponsor: one(sponsors, {
//     fields: [sponsor_links.sponsor_id],
//     references: [sponsors.id],
//   }),
// }));
