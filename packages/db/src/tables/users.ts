import { pgTable, varchar, integer, AnyPgColumn, check } from 'drizzle-orm/pg-core';
import { countries_table } from './translations';
import { medias_table } from './medias';
import { subscription_tiers_table } from './subscriptions';
import { sql } from 'drizzle-orm';

export const users_table = pgTable('users', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  email: varchar('email').unique().notNull(),
  password: varchar('password').notNull(),
  refresh_token: varchar('refresh_token'),
});

export const user_profiles_table = pgTable('user_profiles', {
  user_id: integer('user_id')
    .primaryKey()
    .references(() => users_table.id),

  firstname: varchar('firstname', { length: 255 }),
  lastname: varchar('lastname', { length: 255 }),

  country_id: integer('country_id').references((): AnyPgColumn => countries_table.id),

  avatar_media_id: integer('avatar_media_id').references((): AnyPgColumn => medias_table.id),
  avatar_url: varchar({ length: 255 }),

  banner_media_id: integer('banner_media_id').references((): AnyPgColumn => medias_table.id),
  banner_url: varchar({ length: 255 }),
  subscription_tier_id: integer('subscription_tier_id').notNull().default(1).references((): AnyPgColumn => subscription_tiers_table.id)
}, (table) => [
]);

export const visitors_table = pgTable('visitors', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  code: varchar('code').unique(),
  user_profiles_id: integer('user_profiles_id')
    .notNull()
    .references((): AnyPgColumn => user_profiles_table.user_id),
});
