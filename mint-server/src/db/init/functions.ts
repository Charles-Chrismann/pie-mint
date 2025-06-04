import { db } from "..";
import {
  action_levels_table,
  countries_table,
  languages_table,
  media_contexts_table,
  media_formats_table,
  media_types_table,
  setting_types_table,
  social_platforms_table,
  standard_distances_table
} from "../schema";
import {
  action_levels,
  DBInitCountries,
  DBInitLanguages,
  DBInitMediaContexts,
  DBInitMediaFormats,
  DBInitMediaTypes,
  DBInitSettingTypes,
  social_platforms,
  standard_distances 
} from "./constants";

async function insertStandardDistances() {
  await db.insert(standard_distances_table)
  .values(
    standard_distances.map( 
      i => ({ name: i[0], distance: i[1] })
    )
  )
}

async function insertActionLevels() {
  await db.insert(action_levels_table)
  .values(
    action_levels.map( 
      i => ({ name: i[0] })
    )
  )
}

async function insertSocialPlatforms() {
  await db.insert(social_platforms_table)
  .values(
    social_platforms.map( 
      i => ({ name: i[0] })
    )
  )
}

async function insertMediaFormats() {
  await db.insert(media_formats_table).values(DBInitMediaFormats)
}

async function insertMediaTypes() {
  const mediaFormats = await db.select().from(media_formats_table)

  await db.insert(media_types_table)
  .values(DBInitMediaTypes.map(t => (
    {
      name: t.name,
      mime_type: t.MIMEType,
      media_format_id: mediaFormats.find(i => i.name === t.mediaFormatName)!.id
    }
  )))
}

async function insertMediaContexts() {
  await db.insert(media_contexts_table).values(DBInitMediaContexts)
}

async function insertCountries() {
  await db.insert(countries_table).values(DBInitCountries)
}

async function insertLanguages() {
  const countries = await db.select().from(countries_table)

  await db.insert(languages_table).values(DBInitLanguages.map(l => (
    {
      french_translation: l.french_translation,
      english_translation: l.english_translation,
      self_translation: l.self_translation,
      bcp47: l.bcp47,
      country_id: countries.find(i => i.french_translation === l.contryFrenchName)!.id
    }
  )))
}

async function insertSettingTypes() {
  await db.insert(setting_types_table).values(DBInitSettingTypes)
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
}