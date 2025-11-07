import {
  DBInitMediaFormat,
  DBInitMediaType,
  DBInitMediaContext,
  DBInitCountry,
  DBInitLanguage,
  DBInitSettingType,
  DBGroupUtility,
  DBInitPermission,
  DBInitRaceDiscipline,
  DBInitRaceDisciplineCategory,
  DBInitSubscription,
  DBInitActionLevel,
  DBInitSubscriptionTier,
  DBInitSubscriptionTierFeature,
  DBInitSubscriptionTierSubscriptionTierFeature,
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

const DBInitMediaFormats: DBInitMediaFormat[] = [
  {
    name: 'audio'
  },
  {
    name: 'application'
  },
  {
    name: 'image'
  },
  {
    name: 'video'
  },
  {
    name: 'text'
  },
  {
    name: 'font'
  },
]

const DBInitMediaTypes: DBInitMediaType[] = [
  {
    name: 'aac',
    MIMEType: 'audio/aac',
    mediaFormatName: 'audio'
  },
  {
    name: 'mp3',
    MIMEType: 'audio/mpeg',
    mediaFormatName: 'audio'
  },
  {
    name: 'oga',
    MIMEType: 'audio/ogg',
    mediaFormatName: 'audio'
  },
  {
    name: 'opus',
    MIMEType: 'audio/ogg',
    mediaFormatName: 'audio'
  },
  {
    name: 'wav',
    MIMEType: 'audio/wav',
    mediaFormatName: 'audio'
  },
  {
    name: 'weba',
    MIMEType: 'audio/webm',
    mediaFormatName: 'audio'
  },
  {
    name: 'avif',
    MIMEType: 'image/avif',
    mediaFormatName: 'image'
  },
  {
    name: 'gif',
    MIMEType: 'image/gif',
    mediaFormatName: 'image'
  },
  {
    name: 'jpg',
    MIMEType: 'image/jpeg',
    mediaFormatName: 'image'
  },
  {
    name: 'jpeg',
    MIMEType: 'image/jpeg',
    mediaFormatName: 'image'
  },
  {
    name: 'png',
    MIMEType: 'image/png',
    mediaFormatName: 'image'
  },
  {
    name: 'webp',
    MIMEType: 'image/webp',
    mediaFormatName: 'image'
  },
  {
    name: 'avi',
    MIMEType: 'video/x-msvideo',
    mediaFormatName: 'video'
  },
  {
    name: 'mp4',
    MIMEType: 'video/mp4',
    mediaFormatName: 'video'
  },
  {
    name: 'mpeg',
    MIMEType: 'video/mpeg',
    mediaFormatName: 'video'
  },
  {
    name: 'ogv',
    MIMEType: 'video/ogg',
    mediaFormatName: 'video'
  },
  {
    name: 'webm',
    MIMEType: 'video/webm',
    mediaFormatName: 'video'
  },
]

const DBInitMediaContexts: DBInitMediaContext[] = [
  {
    name: 'avatar'
  },
  {
    name: 'banner'
  },
  {
    name: 'mosaic'
  },
  {
    name: 'post'
  },
  {
    name: 'system/badge'
  },
  {
    name: 'system/social_platform'
  },
]

const DBInitCountries: DBInitCountry[] = [
  {
    "french_translation": "France",
    "english_translation": "France",
    "self_translation": "France",
    "flag_emoji": "🇫🇷"
  },
  {
    "french_translation": "États-Unis",
    "english_translation": "United States",
    "self_translation": "United States",
    "flag_emoji": "🇺🇸"
  },
  {
    "french_translation": "Royaume-Uni",
    "english_translation": "United Kingdom",
    "self_translation": "United Kingdom",
    "flag_emoji": "🇬🇧"
  },
  {
    "french_translation": "Canada",
    "english_translation": "Canada",
    "self_translation": "Canada",
    "flag_emoji": "🇨🇦"
  },
  {
    "french_translation": "Australie",
    "english_translation": "Australia",
    "self_translation": "Australia",
    "flag_emoji": "🇦🇺"
  },
  {
    "french_translation": "Nouvelle-Zélande",
    "english_translation": "New Zealand",
    "self_translation": "New Zealand",
    "flag_emoji": "🇳🇿"
  },
  {
    "french_translation": "Belgique",
    "english_translation": "Belgium",
    "self_translation": "België",
    "flag_emoji": "🇧🇪"
  },
  {
    "french_translation": "Suisse",
    "english_translation": "Switzerland",
    "self_translation": "Schweiz / Suisse / Svizzera",
    "flag_emoji": "🇨🇭"
  },
  {
    "french_translation": "Espagne",
    "english_translation": "Spain",
    "self_translation": "España",
    "flag_emoji": "🇪🇸"
  },
  {
    "french_translation": "Mexique",
    "english_translation": "Mexico",
    "self_translation": "México",
    "flag_emoji": "🇲🇽"
  },
  {
    "french_translation": "Argentine",
    "english_translation": "Argentina",
    "self_translation": "Argentina",
    "flag_emoji": "🇦🇷"
  },
  {
    "french_translation": "Chili",
    "english_translation": "Chile",
    "self_translation": "Chile",
    "flag_emoji": "🇨🇱"
  },
  {
    "french_translation": "Allemagne",
    "english_translation": "Germany",
    "self_translation": "Deutschland",
    "flag_emoji": "🇩🇪"
  },
  {
    "french_translation": "Autriche",
    "english_translation": "Austria",
    "self_translation": "Österreich",
    "flag_emoji": "🇦🇹"
  },
  {
    "french_translation": "Italie",
    "english_translation": "Italy",
    "self_translation": "Italia",
    "flag_emoji": "🇮🇹"
  },
  {
    "french_translation": "Japon",
    "english_translation": "Japan",
    "self_translation": "日本",
    "flag_emoji": "🇯🇵"
  },
  {
    "french_translation": "Chine",
    "english_translation": "China",
    "self_translation": "中国",
    "flag_emoji": "🇨🇳"
  },
  {
    "french_translation": "Brésil",
    "english_translation": "Brazil",
    "self_translation": "Brasil",
    "flag_emoji": "🇧🇷"
  },
  {
    "french_translation": "Portugal",
    "english_translation": "Portugal",
    "self_translation": "Portugal",
    "flag_emoji": "🇵🇹"
  },
  {
    "french_translation": "Pays-Bas",
    "english_translation": "Netherlands",
    "self_translation": "Nederland",
    "flag_emoji": "🇳🇱"
  },
  {
    "french_translation": "Thaïlande",
    "english_translation": "Thailand",
    "self_translation": "ประเทศไทย",
    "flag_emoji": "🇹🇭"
  }
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

export {
  standard_distances,
  action_levels,
  social_platforms,
  DBInitMediaFormats,
  DBInitMediaTypes,
  DBInitMediaContexts,
  DBInitCountries,
  DBInitLanguages,
  DBInitSettingTypes,
  DBInitRaceDisciplineCategories,
  DBInitRaceDisciplines,
  DBInitSubscriptions,
  DBInitSubscriptionTiers,
  DBInitSubscriptionTierFeatures,
  DBInitSubscriptionTierSubscriptionTierFeatures,
}