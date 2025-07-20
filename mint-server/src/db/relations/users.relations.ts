import { relations } from "drizzle-orm";
import { user_profiles_table, users_table } from "../tables/users";

export const usersRelations = relations(users_table, ({ one }) => ({
  user_profile: one(user_profiles_table, {
    fields: [users_table.id],
    references: [user_profiles_table.user_id],
  }),
}));

export const usersProfilesRelations = relations(user_profiles_table, ({ one }) => ({
  user: one(users_table, {
    fields: [user_profiles_table.user_id],
    references: [users_table.id],
  }),
}));