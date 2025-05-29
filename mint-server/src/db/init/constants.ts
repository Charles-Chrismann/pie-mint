import { DBInitMediaFormat, DBInitMediaType, DBInitMediaContext, DBInitCountry, DBInitLanguage, DBInitSettingType, DBGroupUtility } from "./declarations"

const standard_distances: [string, string][] = [
  ["10k", "10000"],
  ["Half marathon", "21097.5"],
  ["Marathon", "42195"],
]

const action_levels = [
  "user",
  "organization",
  "event",
  "sub_event",
  "registration",
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
    french_translation: 'Portugais',
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

const DBGroupeUtility: DBGroupUtility[] = [
  { name: 'runner' },
  { name: 'staff' },
  { name: 'volonteer' },
  { name: 'role' },
  { name: 'permission' },
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
  DBGroupeUtility,
}