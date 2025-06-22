import { pgTable, serial, varchar, boolean, integer, date, numeric } from "drizzle-orm/pg-core";

export const users_table = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email").unique(),
  password: varchar("password"),
  refresh_token: varchar("refresh_token")
});

export const user_profiles_table = pgTable("user_profiles", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  firstname: varchar("firstname"),
  lastname: varchar("lastname"),
  
  user_id: integer("user_id").notNull().references(() => users_table.id),
});