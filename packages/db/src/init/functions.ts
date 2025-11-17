import s3 from "../s3";
import {
  action_levels_table,
  countries_table,
  languages_table,
  media_contexts_table,
  media_types_table,
  medias_table,
  race_discipline_categories_table,
  race_disciplines_table,
  setting_types_table,
  social_platforms_table,
  sponsors_table,
  standard_distances_table
} from "../schema";
import { subscription_tiers_table, subscriptions_table, subscription_tier_features_table, subscription_tiers__subscription_tier_features_table } from "../tables/subscriptions";
import { buildConflictSet } from "../utils";
import {
  action_levels,
  DBInitCountries,
  DBInitLanguages,
  DBInitMediaTypes,
  DBInitRaceDisciplineCategories,
  DBInitRaceDisciplines,
  DBInitSettingTypes,
  DBInitSponsors,
  DBInitSubscriptions,
  DBInitSubscriptionTierFeatures,
  DBInitSubscriptionTiers,
  DBInitSubscriptionTierSubscriptionTierFeatures,
  social_platforms,
  standard_distances
} from "./constants";
import { TransactionType } from "./declarations";
import { readFile } from "fs/promises";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

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

async function insertMediaTypes(tx: TransactionType) {

  const values = DBInitMediaTypes.map(t => (
    {
      id: t.id,
      name: t.name,
      mime_type: t.MIMEType,
      media_format_id: t.mediaFormatName
    }
  ))

  await tx.insert(media_types_table)
    .values(values)
    .onConflictDoUpdate({
      target: media_types_table.name,
      set: buildConflictSet(values[0])
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

async function insertSponsors(tx: TransactionType) {
  await Promise.all(DBInitSponsors.map(async s => {
    const fileContent = await readFile(`./src/init/sponsors/${s.fileName}`);

    const webpBuffer = await sharp(fileContent)
      .webp({ quality: 80 })
      .toBuffer();

    const fileName = [...s.fileName.split('.')].slice(0, -1).join('.')

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `sponsors/${fileName}.webp`,
      Body: webpBuffer,
      ContentType: "image/webp"
    });

    const res = await s3.send(command);

  }))

  const createdMedias = await tx.insert(medias_table)
  .values(DBInitSponsors.map(s => ({
    url: `${process.env.S3_HOST}/${process.env.S3_BUCKET_NAME}/sponsors/${s.id}.webp`,
    is_system: true,
    media_type_id: 12,
    media_context: "system/sponsor" as any,
  })))
  .returning()

  await tx.insert(sponsors_table)
    .values(DBInitSponsors.map((s, i) => ({
      id: s.id,
      name: s.name,
      avatar_media_id: createdMedias[i].id,
      avatar_url: createdMedias[i].url
    })))

  // const fileContent = await readFile("./src/db/assets/init/sponsors/suunto-main.webp"); // ton fichier local
  // const command = new PutObjectCommand({
  //   Bucket: "mint-dev",
  //   Key: "suunto-main.webp",
  //   Body: fileContent, // facultatif, mais recommandé
  //   ContentType: "image/webp",
  // });

  // const res = await s3.send(command);
  // console.log("✅ Fichier uploadé avec succès !", res);

  // const table = sponsors_table
  // const values = DBInitSubscriptionTierSubscriptionTierFeatures

  // return tx.insert(table)
  //   .values(values)
  //   .onConflictDoUpdate({
  //     target: [table.subscription_tier_feature_id, table.subscription_tier_id],
  //     set: buildConflictSet(values[0])
  //   })
  //   .returning()
}

export {
  insertStandardDistances,
  insertActionLevels,
  insertSocialPlatforms,
  insertMediaTypes,
  insertCountries,
  insertLanguages,
  insertSettingTypes,
  insertRaceDisciplineCategories,
  insertRaceDisciplines,
  insertSubscriptions,
  insertSubscriptionTiers,
  insertSubscriptionTierFeatures,
  insertSubscriptionTierSubscriptionTierFeatures,
  insertSponsors,
}