import { relations } from "drizzle-orm";
import { medias_table } from "../tables/medias";
import { organizations_table } from "../tables/organizations";

export const mediasRelations = relations(medias_table, ({ one }) => ({
  organization: one(organizations_table, {
    fields: [medias_table.organization_id],
    references: [organizations_table.id],
  }),
}));
