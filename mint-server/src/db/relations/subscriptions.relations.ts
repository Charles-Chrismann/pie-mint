import { relations } from "drizzle-orm";
import { subscription_tier_features_table, subscription_tiers_table, subscriptions_table, subscription_tiers__subscription_tier_features_table } from "../tables/subscriptions";
import { action_levels_table } from "../tables/enums";
import { user_profiles_table } from "../schema";

export const subscriptionsRelations = relations(subscriptions_table, ({ one, many }) => ({
  action_level: one(action_levels_table, {
    fields: [subscriptions_table.action_level_id],
    references: [action_levels_table.id]
  }),

  subscription_tiers: many(subscription_tiers_table)
}))

export const subscriptionTiersRelations = relations(subscription_tiers_table, ({ one, many }) => ({
  subscription: one(subscriptions_table, {
    fields: [subscription_tiers_table.subscription_id],
    references: [subscriptions_table.id]
  }),

  subscription_tiers__subscription_tier_features: many(subscription_tiers__subscription_tier_features_table),

  user_profiles: many(user_profiles_table),
}))

export const subscriptionTierFeaturesRelations = relations(subscription_tier_features_table, ({ one, many }) => ({
  subscription: one(subscriptions_table, {
    fields: [subscription_tier_features_table.subscription_id],
    references: [subscriptions_table.id]
  }),

  subscription_tiers__subscription_tier_features: many(subscription_tiers__subscription_tier_features_table)
}))

export const subscriptionTierSubscriptionTierFeaturesRelations = relations(subscription_tiers__subscription_tier_features_table, ({ one }) => ({
  subscription_tier: one(subscription_tiers_table, {
    fields: [subscription_tiers__subscription_tier_features_table.subscription_tier_id],
    references: [subscription_tiers_table.id]
  }),

  subscription_tier_feature: one(subscription_tier_features_table, {
    fields: [subscription_tiers__subscription_tier_features_table.subscription_tier_feature_id],
    references: [subscription_tier_features_table.id]
  }),
}))
