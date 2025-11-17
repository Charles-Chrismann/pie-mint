import { relations } from "drizzle-orm";
import { event_campaigns_table, events_table, organizations_table } from "../tables/organizations";
import { medias_table } from "../tables/medias";

export const organizationsRelations = relations(organizations_table, ({ one, many }) => ({
  avatar: one(medias_table, {
    fields: [organizations_table.media_avatar_id],
    references: [medias_table.id],
  }),

  banner: one(medias_table, {
    fields: [organizations_table.media_avatar_id],
    references: [medias_table.id],
  }),

  events: many(events_table)
}));

export const eventsRelations = relations(events_table, ({ one }) => ({
  campaign: one(event_campaigns_table, {
    fields: [events_table.event_campaign_id],
    references: [event_campaigns_table.id],
  }),

  organization: one(organizations_table, {
    fields: [events_table.organization_id],
    references: [organizations_table.id],
  }),
}));