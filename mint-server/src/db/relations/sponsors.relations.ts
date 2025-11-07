import { relations } from "drizzle-orm";
import { sponsors__user_profiles_table, sponsors_table } from "../tables/sponsors";
import { user_profiles_table } from "../tables/users";

export const sponsorsRelations = relations(sponsors_table, ({ many }) => ({
  user_profiles: many(sponsors__user_profiles_table)
}))

export const sponsorsUsersProfilesRelations = relations(sponsors__user_profiles_table, ({ one }) => ({
  user_profiles: one(user_profiles_table, {
    fields: [sponsors__user_profiles_table.user_profile_id],
    references: [user_profiles_table.id]
  }),
  sponsor: one(sponsors_table, {
    fields: [sponsors__user_profiles_table.sponsor_id],
    references: [sponsors_table.id]
  }),
}))