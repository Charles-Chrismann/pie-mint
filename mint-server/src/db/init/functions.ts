import {
  action_levels_table,
  countries_table,
  languages_table,
  media_contexts_table,
  media_formats_table,
  media_types_table,
  race_discipline_categories_table,
  race_disciplines_table,
  setting_types_table,
  social_platforms_table,
  standard_distances_table
} from "../schema";
import { subscription_tiers_table, subscriptions_table, subscription_tier_features_table, subscription_tiers__subscription_tier_features_table } from "../tables/subscriptions";
import { buildConflictSet } from "../utils";
import {
  action_levels,
  DBInitCountries,
  DBInitLanguages,
  DBInitMediaContexts,
  DBInitMediaFormats,
  DBInitMediaTypes,
  DBInitRaceDisciplineCategories,
  DBInitRaceDisciplines,
  DBInitSettingTypes,
  DBInitSubscriptions,
  DBInitSubscriptionTierFeatures,
  DBInitSubscriptionTiers,
  DBInitSubscriptionTierSubscriptionTierFeatures,
  social_platforms,
  standard_distances
} from "./constants";
import { TransactionType } from "./declarations";

async function insertStandardDistances(tx: TransactionType) {
  const values = standard_distances.map(
    i => ({ name: i[0], distance: i[1] })
  )
  await tx.insert(standard_distances_table)
    .values(values)
    .onConflictDoUpdate({
      target: standard_distances_table.name,
      set: buildConflictSet(values[0])
    })
}

async function insertActionLevels(tx: TransactionType) {

  return tx.insert(action_levels_table)
    .values(action_levels)
    .onConflictDoUpdate({
      target: action_levels_table.name,
      set: buildConflictSet(action_levels[0])
    })
    .returning()
}

async function insertSocialPlatforms(tx: TransactionType) {
  const values = social_platforms.map(
    i => ({ name: i[0] })
  )

  await tx.insert(social_platforms_table)
    .values(values)
    .onConflictDoUpdate({
      target: social_platforms_table.name,
      set: buildConflictSet(values[0])
    })
}

async function insertMediaFormats(tx: TransactionType) {
  await
    tx.insert(media_formats_table)
      .values(DBInitMediaFormats)
      .onConflictDoUpdate({
        target: media_formats_table.name,
        set: buildConflictSet(DBInitMediaFormats[0])
      })
}

async function insertMediaTypes(tx: TransactionType) {
  const mediaFormats = await tx.select().from(media_formats_table)

  const values = DBInitMediaTypes.map(t => (
    {
      name: t.name,
      mime_type: t.MIMEType,
      media_format_id: mediaFormats.find(i => i.name === t.mediaFormatName)!.id
    }
  ))

  await tx.insert(media_types_table)
    .values(values)
    .onConflictDoUpdate({
      target: media_types_table.name,
      set: buildConflictSet(values[0])
    })
}

async function insertMediaContexts(tx: TransactionType) {
  await tx.insert(media_contexts_table)
    .values(DBInitMediaContexts)
    .onConflictDoUpdate({
      target: media_contexts_table.name,
      set: buildConflictSet(DBInitMediaContexts[0])
    })
}

async function insertCountries(tx: TransactionType) {
  await tx.insert(countries_table)
    .values(DBInitCountries)
    .onConflictDoUpdate({
      target: countries_table.french_translation,
      set: buildConflictSet(DBInitCountries[0])
    })
}

async function insertLanguages(tx: TransactionType) {
  const countries = await tx.select().from(countries_table)

  const values = DBInitLanguages.map(l => (
    {
      french_translation: l.french_translation,
      english_translation: l.english_translation,
      self_translation: l.self_translation,
      bcp47: l.bcp47,
      country_id: countries.find(i => i.french_translation === l.contryFrenchName)!.id
    }
  ))

  await tx.insert(languages_table)
    .values(values)
    .onConflictDoUpdate({
      target: languages_table.french_translation,
      set: buildConflictSet(values[0])
    })
}

async function insertSettingTypes(tx: TransactionType) {
  await tx.insert(setting_types_table)
    .values(DBInitSettingTypes)
    .onConflictDoUpdate({
      target: setting_types_table.name,
      set: buildConflictSet(DBInitSettingTypes[0])
    })
}

async function insertRaceDisciplineCategories(tx: TransactionType) {
  await tx.insert(race_discipline_categories_table)
    .values(DBInitRaceDisciplineCategories)
    .onConflictDoUpdate({
      target: race_discipline_categories_table.name,
      set: buildConflictSet(DBInitRaceDisciplineCategories[0])
    })
}

async function insertRaceDisciplines(tx: TransactionType) {
  await tx.insert(race_disciplines_table)
    .values(DBInitRaceDisciplines)
    .onConflictDoUpdate({
      target: [race_disciplines_table.name, race_disciplines_table.race_discipline_category_id],
      set: buildConflictSet(DBInitRaceDisciplines[0])
    })
}

async function insertSubscriptions(tx: TransactionType) {
  return tx.insert(subscriptions_table)
    .values(DBInitSubscriptions)
    .onConflictDoUpdate({
      target: subscriptions_table.id,
      set: buildConflictSet(DBInitSubscriptions[0])
    })
    .returning()
}

async function insertSubscriptionTiers(tx: TransactionType) {
  const table = subscription_tiers_table
  const values = DBInitSubscriptionTiers

  return tx.insert(table)
    .values(values)
    .onConflictDoUpdate({
      target: table.id,
      set: buildConflictSet(values[0])
    })
    .returning()
}

async function insertSubscriptionTierFeatures(tx: TransactionType) {
  const table = subscription_tier_features_table
  const values = DBInitSubscriptionTierFeatures

  return tx.insert(table)
    .values(values)
    .onConflictDoUpdate({
      target: table.id,
      set: buildConflictSet(values[0])
    })
    .returning()
}

async function insertSubscriptionTierSubscriptionTierFeatures(tx: TransactionType) {
  const table = subscription_tiers__subscription_tier_features_table
  const values = DBInitSubscriptionTierSubscriptionTierFeatures

  return tx.insert(table)
    .values(values)
    .onConflictDoUpdate({
      target: [table.subscription_tier_feature_id, table.subscription_tier_id],
      set: buildConflictSet(values[0])
    })
    .returning()
}

export {
  insertStandardDistances,
  insertActionLevels,
  insertSocialPlatforms,
  insertMediaFormats,
  insertMediaTypes,
  insertMediaContexts,
  insertCountries,
  insertLanguages,
  insertSettingTypes,
  insertRaceDisciplineCategories,
  insertRaceDisciplines,
  insertSubscriptions,
  insertSubscriptionTiers,
  insertSubscriptionTierFeatures,
  insertSubscriptionTierSubscriptionTierFeatures,
}