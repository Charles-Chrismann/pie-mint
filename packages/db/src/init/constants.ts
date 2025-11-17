import { DBInitCountries } from "./countries.constant"
import {
  DBInitMediaType,
  DBInitLanguage,
  DBInitSettingType,
  DBInitPermission,
  DBInitRaceDiscipline,
  DBInitRaceDisciplineCategory,
  DBInitSubscription,
  DBInitActionLevel,
  DBInitSubscriptionTier,
  DBInitSubscriptionTierFeature,
  DBInitSubscriptionTierSubscriptionTierFeature,
  DBInitSponsor,
} from "./declarations"

const standard_distances: [string, string][] = [
  ["10k", "10000"],
  ["Half marathon", "21097.5"],
  ["Marathon", "42195"],
]

const action_levels: DBInitActionLevel[] = [
  { id: 1, name: 'system' },
  { id: 2, name: 'user' },
  { id: 3, name: 'organization' },
  { id: 4, name: 'event' },
  { id: 5, name: 'race' },
  { id: 6, name: 'registration' },
]

const permissions: DBInitPermission[] = [
  {
    name: "organization:profile:update",
    description: "Modifier le profile de l'organisation",
    name_key: "permissions:name:organization:profile:update",
    description_key: "permissions:description:organization:profile:update",
  }
]

const social_platforms: [string][] = [
  ["Strava"],
  ["Github"],
  ["Instagram"],
  ["Youtube"],
  ["Snapchat"],
  ["X"],
  ["Reddit"],
  ["Linkedin"],
  ["Spotify"],
  ["Deezer"],
]

const DBInitMediaTypes: DBInitMediaType[] = [
  {
    id: 1,
    name: 'aac',
    MIMEType: 'audio/aac',
    mediaFormatName: 'audio'
  },
  {
    id: 2,
    name: 'mp3',
    MIMEType: 'audio/mpeg',
    mediaFormatName: 'audio'
  },
  {
    id: 3,
    name: 'oga',
    MIMEType: 'audio/ogg',
    mediaFormatName: 'audio'
  },
  {
    id: 4,
    name: 'opus',
    MIMEType: 'audio/ogg',
    mediaFormatName: 'audio'
  },
  {
    id: 5,
    name: 'wav',
    MIMEType: 'audio/wav',
    mediaFormatName: 'audio'
  },
  {
    id: 6,
    name: 'weba',
    MIMEType: 'audio/webm',
    mediaFormatName: 'audio'
  },
  {
    id: 7,
    name: 'avif',
    MIMEType: 'image/avif',
    mediaFormatName: 'image'
  },
  {
    id: 8,
    name: 'gif',
    MIMEType: 'image/gif',
    mediaFormatName: 'image'
  },
  {
    id: 9,
    name: 'jpg',
    MIMEType: 'image/jpeg',
    mediaFormatName: 'image'
  },
  {
    id: 10,
    name: 'jpeg',
    MIMEType: 'image/jpeg',
    mediaFormatName: 'image'
  },
  {
    id: 11,
    name: 'png',
    MIMEType: 'image/png',
    mediaFormatName: 'image'
  },
  {
    id: 12,
    name: 'webp',
    MIMEType: 'image/webp',
    mediaFormatName: 'image'
  },
  {
    id: 13,
    name: 'avi',
    MIMEType: 'video/x-msvideo',
    mediaFormatName: 'video'
  },
  {
    id: 14,
    name: 'mp4',
    MIMEType: 'video/mp4',
    mediaFormatName: 'video'
  },
  {
    id: 15,
    name: 'mpeg',
    MIMEType: 'video/mpeg',
    mediaFormatName: 'video'
  },
  {
    id: 16,
    name: 'ogv',
    MIMEType: 'video/ogg',
    mediaFormatName: 'video'
  },
  {
    id: 17,
    name: 'webm',
    MIMEType: 'video/webm',
    mediaFormatName: 'video'
  },
]

const DBInitLanguages: DBInitLanguage[] = [
  {
    french_translation: 'Français',
    english_translation: 'French',
    self_translation: 'Français',
    bcp47: 'fr-FR',
    contryFrenchName: 'France'
  },
  {
    french_translation: 'Anglais',
    english_translation: 'English',
    self_translation: 'English',
    bcp47: 'en-US',
    contryFrenchName: "États-Unis"
  },
  {
    french_translation: 'Espagnol',
    english_translation: 'Spanish',
    self_translation: 'Español',
    bcp47: 'es-ES',
    contryFrenchName: "Espagne"
  },
  {
    french_translation: 'Allemand',
    english_translation: 'German',
    self_translation: 'Deutsch',
    bcp47: 'de-DE',
    contryFrenchName: "Allemagne"
  },
  {
    french_translation: 'Italien',
    english_translation: 'Italian',
    self_translation: 'Italiano',
    bcp47: 'it-IT',
    contryFrenchName: "Italie"
  },
  {
    french_translation: 'Japonais',
    english_translation: 'Japanese',
    self_translation: '日本語',
    bcp47: 'ja-JP',
    contryFrenchName: "Japon"
  },
  {
    french_translation: 'Chinois',
    english_translation: 'Chinese',
    self_translation: '中国人',
    bcp47: 'zh-CN',
    contryFrenchName: "Chine"
  },
  {
    french_translation: 'Portugais',
    english_translation: 'Portuguese',
    self_translation: 'Português',
    bcp47: 'pt-PT',
    contryFrenchName: "Portugal"
  },
  {
    french_translation: 'Portugais (Brésil)',
    english_translation: 'Portuguese',
    self_translation: 'Português',
    bcp47: 'pt-BR',
    contryFrenchName: "Brésil"
  },
  {
    french_translation: 'Néerlandais',
    english_translation: 'Dutch',
    self_translation: 'Nederlands',
    bcp47: 'nl-NL',
    contryFrenchName: "Pays-Bas"
  },
  {
    french_translation: 'Thaï',
    english_translation: 'Thai',
    self_translation: 'ไทย',
    bcp47: 'th-TH',
    contryFrenchName: "Thaïlande"
  },
]

const DBInitSettingTypes: DBInitSettingType[] = [
  { name: 'checkbox' },
  { name: 'radio' },
  { name: 'toggle' },
  { name: 'number' },
  { name: 'string' },
]

const DBInitRaceDisciplineCategories: DBInitRaceDisciplineCategory[] = [
  {id: 1, name: 'Running'},
  {id: 2, name: 'Cycling'},
]

const DBInitRaceDisciplines: DBInitRaceDiscipline[] = [
  { id: 1, race_discipline_category_id: 1, name: 'Road' },
  { id: 2, race_discipline_category_id: 1, name: 'Trail' },
  { id: 3, race_discipline_category_id: 1, name: 'Canicross' },
  { id: 4, race_discipline_category_id: 1, name: 'Obstacle' },
  { id: 5, race_discipline_category_id: 2, name: 'Road' },
]

const DBInitSubscriptions: DBInitSubscription[] = [
  {
    id: 1,
    name: 'Runners',
    action_level_id: 2
  }
]

const DBInitSubscriptionTiers: DBInitSubscriptionTier[] = [
  { id: 1, name: 'Basic', subscription_id: 1 },
  { id: 2, name: 'Premium', subscription_id: 1 },
  { id: 3, name: 'Pro', subscription_id: 1 },
]

const DBInitSubscriptionTierFeatures: DBInitSubscriptionTierFeature[] = [
  { id: 1, index: 1, name: 'Feature 1', description: 'description de la feature 1', subscription_id: 1 },
  { id: 2, index: 2, name: 'Feature 2', description: 'description de la feature 2', subscription_id: 1 },
  { id: 3, index: 3, name: 'Feature 3', description: 'description de la feature 3', subscription_id: 1 },
  { id: 4, index: 4, name: 'Feature 4', description: 'description de la feature 4', subscription_id: 1 },
  { id: 5, index: 5, name: 'Feature 5', description: 'description de la feature 5', subscription_id: 1 },
]

const DBInitSubscriptionTierSubscriptionTierFeatures: DBInitSubscriptionTierSubscriptionTierFeature[] = [
  { subscription_tier_feature_id: 1, subscription_tier_id: 1, is_included: true },
  { subscription_tier_feature_id: 1, subscription_tier_id: 2, is_included: true },
  { subscription_tier_feature_id: 1, subscription_tier_id: 3, is_included: true },
  { subscription_tier_feature_id: 2, subscription_tier_id: 1, is_included: true },
  { subscription_tier_feature_id: 2, subscription_tier_id: 2, is_included: true },
  { subscription_tier_feature_id: 2, subscription_tier_id: 3, is_included: true },
  { subscription_tier_feature_id: 3, subscription_tier_id: 1, is_included: false },
  { subscription_tier_feature_id: 3, subscription_tier_id: 2, is_included: true },
  { subscription_tier_feature_id: 3, subscription_tier_id: 3, is_included: true },
  { subscription_tier_feature_id: 4, subscription_tier_id: 1, is_included: false },
  { subscription_tier_feature_id: 4, subscription_tier_id: 2, is_included: false },
  { subscription_tier_feature_id: 4, subscription_tier_id: 3, is_included: true },
  { subscription_tier_feature_id: 5, subscription_tier_id: 1, is_included: false },
  { subscription_tier_feature_id: 5, subscription_tier_id: 2, is_included: false },
  { subscription_tier_feature_id: 5, subscription_tier_id: 3, is_included: true },
]

const DBInitSponsors: DBInitSponsor[] = [
  {
    id: 1,
    name: "Dacia",
    fileName: "dacia.webp",
  },
  {
    id: 2,
    name: "Hoka",
    fileName: "hoka.webp",
  },
  {
    id: 3,
    name: "Naak",
    fileName: "naak.webp",
  },
  {
    id: 4,
    name: "Nnormal",
    fileName: "nnormal.webp",
  },
  {
    id: 5,
    name: "On",
    fileName: "on.svg",
  },
  {
    id: 6,
    name: "Salomon",
    fileName: "salomon.png",
  },
  {
    id: 7,
    name: "Suunto",
    fileName: "suunto.webp",
  },
  {
    id: 8,
    name: "The Noth Face",
    fileName: "the_north_face.png",
  },
]

export {
  standard_distances,
  action_levels,
  social_platforms,
  DBInitMediaTypes,
  DBInitCountries,
  DBInitLanguages,
  DBInitSettingTypes,
  DBInitRaceDisciplineCategories,
  DBInitRaceDisciplines,
  DBInitSubscriptions,
  DBInitSubscriptionTiers,
  DBInitSubscriptionTierFeatures,
  DBInitSubscriptionTierSubscriptionTierFeatures,
  DBInitSponsors,
}