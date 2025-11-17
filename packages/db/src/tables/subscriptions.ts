import { AnyPgColumn, boolean, integer, pgTable, primaryKey, smallint, text, varchar } from "drizzle-orm/pg-core";
import { action_levels_table } from "./enums";

export const subscriptions_table = pgTable('subscriptions', {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar('name', { length: 256 }).notNull(),

  action_level_id: integer('action_level_id').references((): AnyPgColumn => action_levels_table.id),
})

export const subscription_tiers_table = pgTable('subscription_tiers', {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar('name', { length: 256 }).notNull(),

  subscription_id: integer('subscription_id').references((): AnyPgColumn => subscriptions_table.id),
})

export const subscription_tier_features_table = pgTable('subscription_tier_features', {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  index: smallint('index').notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  description: text('description').notNull(),

  subscription_id: integer('subscription_id').references((): AnyPgColumn => subscriptions_table.id),
})

export const subscription_tiers__subscription_tier_features_table = pgTable('sub_tiers__sub_tier_feat', {
  is_included: boolean('is_included').notNull(),

  subscription_tier_id: integer("subscription_tier_id").notNull().references((): AnyPgColumn => subscription_tiers_table.id),
  subscription_tier_feature_id: integer("subscription_tier_feature_id").notNull().references((): AnyPgColumn => subscription_tier_features_table.id),
}, (table) => [
  primaryKey({
    name: 'pk_subscription_tiers__subscription_tier_features',
    columns: [
      table.subscription_tier_id,
      table.subscription_tier_feature_id
    ]
  }),
])