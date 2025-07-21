import { pgTable, varchar, integer, AnyPgColumn } from 'drizzle-orm/pg-core';

export const users_table = pgTable('users', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  email: varchar('email').unique().notNull(),
  password: varchar('password').notNull(),
  refresh_token: varchar('refresh_token'),
});

export const user_profiles_table = pgTable('user_profiles', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),

  firstname: varchar('firstname'),
  lastname: varchar('lastname'),

  user_id: integer('user_id')
    .notNull()
    .references(() :AnyPgColumn => users_table.id),
});

export const visitors_table = pgTable('visitors', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  code: varchar('code').unique(),
  user_profiles_id: integer('user_profiles_id')
    .notNull()
    .references(() :AnyPgColumn => user_profiles_table.id),
});
