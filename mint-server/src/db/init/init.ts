import {
  insertActionLevels,
  insertCountries,
  insertLanguages,
  insertMediaContexts,
  insertMediaFormats,
  insertMediaTypes,
  insertSettingTypes,
  insertSocialPlatforms,
  insertStandardDistances
} from "./functions"

async function main() {
  const now = performance.now()
  console.log(`Initialyzing database...`)

  console.log(`Inserting no relationship tables...`)
  // Inserting no relationship tables
  await Promise.all([
    insertStandardDistances(),
    insertActionLevels(),
    insertSocialPlatforms(),
    insertMediaFormats(),
    insertMediaContexts(),
    insertCountries(),
    insertSettingTypes(),
  ])

  console.log(`Inserting tables with relationship...`)
  // Inserting tables with relationship
  await Promise.all([
    insertMediaTypes(),
    insertLanguages(),
  ])

  console.log(`Database initialized in: ${performance.now() - now} ms`)
}

main()