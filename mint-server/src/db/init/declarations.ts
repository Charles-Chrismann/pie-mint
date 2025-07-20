import { ExtractTablesWithRelations } from "drizzle-orm"
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres"
import { PgTransaction } from "drizzle-orm/pg-core"

interface DBInitMediaFormat {
  name: string
}

interface DBInitMediaType {
  name: string
  MIMEType: string

  mediaFormatName: string
}

interface DBInitMediaContext {
  name: string
}

interface DBInitMedia {
  url: string
  isSystem: boolean

  mediaTypeName: string
  mediaContextName: string
  actionLevelName: string
}

interface DBInitCountry {
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

// type TransactionType = PgTransaction<NodePgQueryResultHKT, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>

type TransactionType = any

export {
  DBInitMediaFormat,
  DBInitMediaType,
  DBInitMediaContext,
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
}