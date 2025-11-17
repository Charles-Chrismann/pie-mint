import { relations } from "drizzle-orm";
import { countries_table } from "../tables/translations";
import { user_profiles_table } from "../tables/users";

export const countriesRelations = relations(countries_table, ({ many }) => ({
  user_profiles: many(user_profiles_table)
}))