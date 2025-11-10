import { ExtractTablesWithRelations } from "drizzle-orm"
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres"
import { PgTransaction } from "drizzle-orm/pg-core"
import { db } from ".."

interface DBInitActionLevel {
  id: number
  name: string
}

interface DBInitMediaType {
  id: number
  name: string
  MIMEType: string

  mediaFormatName: string
}

interface DBInitMedia {
  url: string
  isSystem: boolean

  mediaTypeName: string
  mediaContextName: string
  actionLevelName: string
}

interface DBInitCountry {
  id: number
  french_translation: string
  english_translation: string
  self_translation: string
  flag_emoji: string
}

interface DBInitLanguage {
  french_translation: string
  english_translation: string
  self_translation: string
  bcp47 : string

  contryFrenchName: string
}

interface DBInitSettingCategory {
  is_gloabl: boolean
  name_key: string
  description_key: string

  action_level_name: string
}

interface DBInitSettingType {
  name: string
}

interface DBGroupUtility {
  name: string
}

interface DBInitPermission {
  name: string
  description: string
  name_key: string
  description_key: string
}

interface DBInitRaceDiscipline {
  id: number
  name: string
  race_discipline_category_id: number
}

interface DBInitRaceDisciplineCategory {
  id: number
  name: string
}

type TransactionType = Parameters<typeof db.transaction>[0] extends (tx: infer T) => any ? T : never;

// type TransactionType = any

interface DBInitSubscription {
  id: number
  name: string

  action_level_id: number
}

interface DBInitSubscriptionTier {
  id: number
  name: string

  subscription_id: number
}

interface DBInitSubscriptionTierFeature {
  id: number
  index: number
  name: string
  description: string

  subscription_id: number
}

interface DBInitSubscriptionTierSubscriptionTierFeature {
  is_included: boolean

  subscription_tier_id: number
  subscription_tier_feature_id: number
}

interface DBInitSponsor {
  id: number
  name: string
  fileName: string
}

export {
  DBInitActionLevel,
  DBInitMediaType,
  DBInitMedia,
  DBInitCountry,
  DBInitLanguage,
  DBInitSettingCategory,
  DBInitSettingType,
  DBGroupUtility,
  DBInitPermission,
  DBInitRaceDiscipline,
  DBInitRaceDisciplineCategory,
  TransactionType,
  DBInitSubscription,
  DBInitSubscriptionTier,
  DBInitSubscriptionTierFeature,
  DBInitSubscriptionTierSubscriptionTierFeature,
  DBInitSponsor,
}