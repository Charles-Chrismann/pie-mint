import "dotenv/config"
import { db } from ".."
import {
  insertActionLevels,
  insertCountries,
  insertLanguages,
  insertMediaTypes,
  insertRaceDisciplines,
  insertRaceDisciplineCategories,
  insertSettingTypes,
  insertSocialPlatforms,
  insertStandardDistances,
  insertSubscriptions,
  insertSubscriptionTiers,
  insertSubscriptionTierFeatures,
  insertSubscriptionTierSubscriptionTierFeatures,
  insertSponsors
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
      insertCountries(tx),
      insertSettingTypes(tx),
      insertRaceDisciplineCategories(tx),
      insertMediaTypes(tx),
    ])
  
    console.log(`Inserting tables with relationship...`)
    // Inserting tables with relationship
    await Promise.all([
      insertLanguages(tx),
      insertRaceDisciplines(tx),
      insertSubscriptions(tx),
      insertSponsors(tx),
    ])

    // Inserting tables with second level relationships
    await Promise.all([
      insertSubscriptionTiers(tx),
      insertSubscriptionTierFeatures(tx),
    ])

    // // Inserting tables with third level relationships
    await Promise.all([
      insertSubscriptionTierSubscriptionTierFeatures(tx),
    ])
  })


  console.log(`Database initialized in: ${performance.now() - now} ms`)
}

main()