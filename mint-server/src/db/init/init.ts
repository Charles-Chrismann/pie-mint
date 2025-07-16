import { db } from ".."
import {
  insertActionLevels,
  insertCountries,
  insertLanguages,
  insertMediaContexts,
  insertMediaFormats,
  insertMediaTypes,
  insertRaceDiscipline,
  insertRaceDisciplineCategories,
  insertSettingTypes,
  insertSocialPlatforms,
  insertStandardDistances
} from "./functions"

async function main() {
  const now = performance.now()
  console.log(`Initialyzing database...`)

  const results = await db.transaction(async tx => {
    console.log(`Inserting no relationship tables...`)
    // Inserting no relationship tables
    await Promise.all([
      insertStandardDistances(tx),
      insertActionLevels(tx),
      insertSocialPlatforms(tx),
      insertMediaFormats(tx),
      insertMediaContexts(tx),
      insertCountries(tx),
      insertSettingTypes(tx),
      insertRaceDisciplineCategories(tx),
    ])
  
    console.log(`Inserting tables with relationship...`)
    // Inserting tables with relationship
    await Promise.all([
      insertMediaTypes(tx),
      insertLanguages(tx),
      insertRaceDiscipline(tx),
    ])
  })


  console.log(`Database initialized in: ${performance.now() - now} ms`)
}

main()