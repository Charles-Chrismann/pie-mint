import { relations } from "drizzle-orm";
import { user_profiles_table, users_table } from "../tables/users";
import { registrations_table } from "../tables/races";
import { subscription_tiers_table } from "../tables/subscriptions";
import { countries_table, medias_table, sponsors__user_profiles_table } from "../schema";

export const usersRelations = relations(users_table, ({ one }) => ({
  user_profile: one(user_profiles_table, {
    fields: [users_table.id],
    references: [user_profiles_table.user_id],
  }),
}));

export const usersProfilesRelations = relations(user_profiles_table, ({ one, many }) => ({
  user: one(users_table, {
    fields: [user_profiles_table.user_id],
    references: [users_table.id],
  }),

  subscription: one(subscription_tiers_table, {
    fields: [user_profiles_table.subscription_tier_id],
    references: [subscription_tiers_table.id]
  }),

  registrations: many(registrations_table),
  sponsors: many(sponsors__user_profiles_table),
  country: one(countries_table, {
    fields: [user_profiles_table.country_id],
    references: [countries_table.id],
  }),

  avatar: one(medias_table, {
    fields: [user_profiles_table.avatar_media_id],
    references: [medias_table.id]
  }),

  banner: one(medias_table, {
    fields: [user_profiles_table.banner_media_id],
    references: [medias_table.id]
  }),
}));