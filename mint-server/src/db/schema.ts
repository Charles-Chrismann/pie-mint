import * as enumsTable from "./tables/enums";
import * as usersTables from "./tables/users";
import * as organizationsTables from "./tables/organizations";
import * as sponsorsTables from "./tables/sponsors";
import * as racesTables from "./tables/races";
import * as controlsTables from "./tables/controls";
import * as translationsTables from "./tables/translations";
import * as mediasTables from "./tables/medias";
import * as settingsTables from "./tables/settings";
import * as profileLinksTables from "./tables/profile_links";
import * as badgesTables from "./tables/badges";
import * as subscriptionsTables from "./tables/subscriptions";

import * as organizationsRelations from "./relations/organizations.relations";
import * as mediasRelations from "./relations/medias.relations";
import * as usersRelations from "./relations/users.relations";
import * as racesRelations from "./relations/races.relations"
import * as subscriptionsRelations from "./relations/subscriptions.relations"
import * as sponsorsRelations from "./relations/sponsors.relations"
import * as translationsRelations from "./relations/translations.relations"

export const schema = {
  ...enumsTable,
  ...usersTables,
  ...organizationsTables,
  ...sponsorsTables,
  ...racesTables,
  ...controlsTables,
  ...translationsTables,
  ...mediasTables,
  ...settingsTables,
  ...profileLinksTables,
  ...badgesTables,
  ...subscriptionsTables,

  ...organizationsRelations,
  ...mediasRelations,
  ...usersRelations,
  ...racesRelations,
  ...subscriptionsRelations,
  ...sponsorsRelations,
  ...translationsRelations,
};

export * from "./tables/enums"
export * from "./tables/users"
export * from "./tables/organizations"
export * from "./tables/sponsors"
export * from "./tables/races"
export * from "./tables/controls"
export * from "./tables/translations"
export * from "./tables/medias"
export * from "./tables/settings"
export * from "./tables/profile_links"
export * from "./tables/badges"
export * from "./tables/subscriptions"

export * from "./relations/organizations.relations"
export * from "./relations/medias.relations"
export * from "./relations/users.relations"
export * from "./relations/races.relations"
export * from "./relations/subscriptions.relations"
export * from "./relations/sponsors.relations"
export * from "./relations/translations.relations"
