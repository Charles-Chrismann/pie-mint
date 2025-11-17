import { relations } from "drizzle-orm";
import { action_levels_table } from "../tables/enums";
import { subscriptions_table } from "../tables/subscriptions";

export const actionLevelsRelations = relations(action_levels_table, ({ many }) => ({
  subscriptions: many(subscriptions_table)
}))