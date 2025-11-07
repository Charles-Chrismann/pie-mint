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
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),

  username: varchar('username', { length: 256 }).notNull().unique(),
  firstname: varchar('firstname', { length: 256 }),
  lastname: varchar('lastname', { length: 256 }),

  country_id: integer('country_id').references((): AnyPgColumn => countries_table.id),
  avatar_media_id: integer('avatar_media_id').references((): AnyPgColumn => medias_table.id),
  banner_media_id: integer('banner_media_id').references((): AnyPgColumn => medias_table.id),
  user_id: integer('user_id')
    .notNull()
    .references((): AnyPgColumn => users_table.id),
  subscription_tier_id: integer('subscription_tier_id').notNull().default(1).references((): AnyPgColumn => subscription_tiers_table.id)
}, (table) => [
  check('username_format_check', sql`${table.username} ~ '^[A-Za-z][A-Za-z0-9._-]{3,63}$'`)
]);

export const visitors_table = pgTable('visitors', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  code: varchar('code').unique(),
  user_profiles_id: integer('user_profiles_id')
    .notNull()
    .references((): AnyPgColumn => user_profiles_table.id),
});
