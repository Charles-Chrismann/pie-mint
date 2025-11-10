import {
  Organization,
  Sponsor,
  DBSeedUser,
  DBSeedUserProfile,
  DBSeedMedia,
} from "./declarations"

const organizations: Organization[] = [
  {
    name: 'Schneider Electric - Marathon de Paris',
    events: [],
  },
  {
    name: 'Abalone - Marathon de Nantes',
    events: [
      {
        name: 'Marathon de Nantes 2026',
        start_date: new Date("April 25, 2026"),
        end_date: new Date("April 26, 2026"),
        event_campaign: {
          name: 'Marathon de Nantes',
          description: 'Les éditions du marathon de Nantes',
        },

        races: [
          {
            name: 'Marathon',
            standard_distance: 'Marathon',
            race_discipline_id: 1,

            track: {
              name: 'La track du marathon de Nantes 2026',
              gpx: 'nantes_marathon.gpx'
            },
          }
        ]
      }
    ]
  },
  {
    name: 'Lyon Urban Trail',
    events: [
      {
        name: 'Lyon Urban Trail 2025',
        start_date: new Date("March 30, 2025"),
        end_date: new Date("March 30, 2025"),

        races: [
          {
            name: 'Le 37km',
            distance: "37000",
            positive_elevation: "1500",
            race_discipline_id: 2,

            track: {
              name: 'La track du LUT 2025 - 37km',
              gpx: 'lut-2025-37km.gpx'
            },
            start_waves: [
              {
                is_elite: true,
                name: "La vague elite du lut 2025",
                start_time: new Date("March 30, 2025 07:30:00"),
                wave_index: 1
              },
              {
                is_elite: false,
                name: "La vague 1 du lut 2025",
                start_time: new Date("March 30, 2025 07:30:00"),
                wave_index: 2
              },
              {
                is_elite: false,
                name: "La vague 2 du lut 2025",
                start_time: new Date("March 30, 2025 07:35:00"),
                wave_index: 3
              },
              {
                is_elite: false,
                name: "La vague 3 du lut 2025",
                start_time: new Date("March 30, 2025 07:40:00"),
                wave_index: 4
              },
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'UTMB',
    events: [
      {
        name: 'Trail du Saint-Jacques by UTMB',
        start_date: new Date("June 13, 2025"),
        end_date: new Date("June 15, 2025"),

        races: [
          {
            name: 'Ultra du Saint Jacques - 100M',
            distance: "134000",
            positive_elevation: "6050",
            race_discipline_id: 2,

            track: {
              name: 'Ultra du Saint Jacques - 100M',
              gpx: 'tsj_25_ultra_9dcb2f834c.gpx'
            }
          },
          {
            name: 'Grand Trail du Saint Jacques - 100K',
            distance: "81000",
            positive_elevation: "3400",
            race_discipline_id: 2,

            track: {
              name: 'Grand Trail du Saint Jacques - 100K',
              gpx: 'tsj_25_grand_trail_c98365eb07.gpx'
            }
          },
          {
            name: 'Monistrail - 50K',
            distance: "54000",
            positive_elevation: "2050",
            race_discipline_id: 2,

            track: {
              name: 'Monistrail - 50K',
              gpx: 'tsj_25_monistrail_9974f56408.gpx'
            }
          },
          {
            name: 'Les Chibottes - 20K',
            distance: "26000",
            positive_elevation: "750",
            race_discipline_id: 2,

            track: {
              name: 'Les Chibottes - 20K',
              gpx: 'tsj25_chibottes_a16cd32812.gpx'
            }
          },
          {
            name: 'Le 12 du Dolaizon',
            distance: "12000",
            positive_elevation: "210",
            race_discipline_id: 2,

            track: {
              name: 'Le 12 du Dolaizon',
              gpx: 'tsj25_petit_parcours_19924150_1737477398_578_a538ae0a86.gpx'
            }
          },
          {
            name: 'Rando 26km',
            distance: "26000",
            positive_elevation: "750",
            race_discipline_id: 2,

            track: {
              name: 'Rando 26km',
              gpx: 'tsj_25_chibottes_07cbe8f788.gpx'
            }
          },
        ]
      },
      {
        name: "Grand Raid Ventoux by UTMB",
        start_date: new Date("April 25, 2025"),
        end_date: new Date("April 27, 2025"),
        races: [
          {
            name: "GRV - 100M",
            distance: "124000",
            positive_elevation: "6500",
            race_discipline_id: 2,

            track: {
              name: "GRV - 100M",
              gpx: "GRV_100_M_3130c5bfc9.gpx"
            }
          },
          {
            name: "GRV - 100K",
            distance: "89000",
            positive_elevation: "4600",
            race_discipline_id: 2,

            track: {
              name: "GRV - 100K",
              gpx: "GRV_100_K_d7ac898f01.gpx"
            }
          },
          {
            name: "GRV - 50K",
            distance: "49000",
            positive_elevation: "2200",
            race_discipline_id: 2,

            track: {
              name: "GRV - 50K",
              gpx: "GRV_50_K_8a5d694e54.gpx"
            }
          },
          {
            name: "GRV - 20K",
            distance: "28000",
            positive_elevation: "1200",
            race_discipline_id: 2,

            track: {
              name: "GRV - 20K",
              gpx: "GRV_20_K_2d74ea6b81.gpx"
            }
          }
        ]
      },
      {
        name: "Restonica Trail by UTMB",
        start_date: new Date("July 03, 2025"),
        end_date: new Date("July 05, 2025"),
        races: [
          {
            name: "UTC100M",
            distance: "110000",
            positive_elevation: "7200",
            race_discipline_id: 2,

            track: {
              name: "UTC100M",
              gpx: "UTC_2025_d905fb7c2a.gpx"
            }
          },
          {
            name: "RT100K",
            distance: "67000",
            positive_elevation: "3900",
            race_discipline_id: 2,

            track: {
              name: "RT100K",
              gpx: "RT_2025_47643f828c.gpx"
            }
          },
          {
            name: "TT50K",
            distance: "33000",
            positive_elevation: "2400",
            race_discipline_id: 2,

            track: {
              name: "TT50K",
              gpx: "TT_2025_70d0b03ccb.gpx"
            }
          },
          {
            name: "GT20K",
            distance: "17000",
            positive_elevation: "650",
            race_discipline_id: 2,

            track: {
              name: "GT20K",
              gpx: "GT_2025_16337d7757.gpx"
            }
          }
        ]
      }
    ]
  },
]

const sponsors: Sponsor[] = [
  {
    id: 1,
    name: 'Salomon',
  },
  {
    id: 2,
    name: 'Hoka',
  },
  {
    id: 3,
    name: 'Nike',
  },
  {
    id: 4,
    name: 'Saucony',
  },
]

const DBSeedUsers: DBSeedUser[] = [
  {
    id: 2,
    email: "caroline.chaverot@example.com",
  },
  {
    id: 3,
    email: "christophe.jaquerod@example.com",
  },
  {
    id: 4,
    email: "colette.borcard@example.com",
  },
  {
    id: 5,
    email: "courtney.dawalter@example.com",
  },
  {
    id: 6,
    email: "dawa.sherpa@example.com",
  },
  {
    id: 7,
    email: "francesca.canepa@example.com",
  },
  {
    id: 8,
    email: "francois.dhaene@example.com",
  },
  {
    id: 9,
    email: "jez.bragg@example.com",
  },
  {
    id: 10,
    email: "jim.walmsley@example.com",
  },
  {
    id: 11,
    email: "karine.henrry@example.com",
  },
  {
    id: 12,
    email: "katie.shide@example.com",
  },
  {
    id: 13,
    email: "kilian.jornetburgada@example.com",
  },
  {
    id: 14,
    email: "krissy.moehl@example.com",
  },
  {
    id: 15,
    email: "nathalie.mauclair@example.com",
  },
  {
    id: 16,
    email: "nikki.kimball@example.com",
  },
  {
    id: 17,
    email: "nuria.picas@example.com",
  },
  {
    id: 18,
    email: "pau.capell@example.com",
  },
  {
    id: 19,
    email: "rory.bosio@example.com",
  },
  {
    id: 20,
    email: "vincent.delebarre@example.com",
  },
  {
    id: 21,
    email: "xavier.thevenard@example.com",
  },
  {
    id: 22,
    email: "marco.olmo@example.com",
  },
  {
    id: 23,
    email: "elizabeth.hawker@example.com",
  },
]

const DBSeedUserProfiles: DBSeedUserProfile[] = [
  {
    user_id: 2,
    firstname: "Caroline",
    lastname: "Chaverot",
    country_id: 75,
    subscription_tier_id: 1
  },
  {
    user_id: 3,
    firstname: "Christophe",
    lastname: "Jaquerod",
    country_id: 214,
    subscription_tier_id: 1
  },
  {
    user_id: 4,
    firstname: "Colette",
    lastname: "Borcard",
    country_id: 214,
    subscription_tier_id: 1
  },
  {
    user_id: 5,
    firstname: "Courtney",
    lastname: "Dawalter",
    country_id: 233,
    subscription_tier_id: 1
  },
  {
    user_id: 6,
    firstname: "Dawa",
    lastname: "Sherpa",
    country_id: 154,
    subscription_tier_id: 1
  },
  {
    user_id: 7,
    firstname: "Francesca",
    lastname: "Canepa",
    country_id: 107,
    subscription_tier_id: 1
  },
  {
    user_id: 8,
    firstname: "François",
    lastname: "D'Haene",
    country_id: 75,
    subscription_tier_id: 1
  },
  {
    user_id: 9,
    firstname: "Jez",
    lastname: "Bragg",
    country_id: 232,
    subscription_tier_id: 1
  },
  {
    user_id: 10,
    firstname: "Jim",
    lastname: "Walmsley",
    country_id: 233,
    subscription_tier_id: 1
  },
  {
    user_id: 11,
    firstname: "Karine",
    lastname: "Henrry",
    country_id: 75,
    subscription_tier_id: 1
  },
  {
    user_id: 12,
    firstname: "Katie",
    lastname: "Shide",
    country_id: 233,
    subscription_tier_id: 1
  },
  {
    user_id: 13,
    firstname: "Kilian",
    lastname: "Jornet Burgada",
    country_id: 207,
    subscription_tier_id: 1
  },
  {
    user_id: 14,
    firstname: "Krissy",
    lastname: "Moehl",
    country_id: 75,
    subscription_tier_id: 1
  },
  {
    user_id: 15,
    firstname: "Nathalie",
    lastname: "Mauclair",
    country_id: 75,
    subscription_tier_id: 1
  },
  {
    user_id: 16,
    firstname: "Nikki",
    lastname: "Kimball",
    country_id: 233,
    subscription_tier_id: 1
  },
  {
    user_id: 17,
    firstname: "Núria",
    lastname: "Picas",
    country_id: 207,
    subscription_tier_id: 1
  },
  {
    user_id: 18,
    firstname: "Pau",
    lastname: "Capell",
    country_id: 207,
    subscription_tier_id: 1
  },
  {
    user_id: 19,
    firstname: "Rory",
    lastname: "Bosio",
    country_id: 233,
    subscription_tier_id: 1
  },
  {
    user_id: 20,
    firstname: "Vincent",
    lastname: "Delebarre",
    country_id: 75,
    subscription_tier_id: 1
  },
  {
    user_id: 21,
    firstname: "Xavier",
    lastname: "Thevenard",
    country_id: 75,
    subscription_tier_id: 1
  },
  {
    user_id: 22,
    firstname: "Marco",
    lastname: "Olmo",
    country_id: 107,
    subscription_tier_id: 1
  },
  {
    user_id: 23,
    firstname: "Elizabeth",
    lastname: "Hawker",
    country_id: 232,
    subscription_tier_id: 1
  },
]

const DBSeedUserProfilesSponsors = [
  { sponsor_id: 2, user_profile_id: 10 },
  { sponsor_id: 5, user_profile_id: 12 },
  { sponsor_id: 4, user_profile_id: 13 },
  { sponsor_id: 6, user_profile_id: 5 },
  { sponsor_id: 8, user_profile_id: 18 },
]

const DBSeedUserProfilePictureUrls: string[] = [
  "caroline_chaverot.png",
  "christophe_jaquerod.avif",
  "colette_borcard.avif",
  "courtney_dawalter.avif",
  "dawa_sherpa.avif",
  "francesca_canepa.avif",
  "francois_dhaene.avif",
  "jez_bragg.avif",
  "jim_walmsley.avif",
  "karine_herry.avif",
  "katie_shide.avif",
  "kilian_jornetburgada.avif",
  "krissy_moehl.avif",
  "nathalie_mauclair.webp",
  "nikki_kimball.avif",
  "nuria_picas.avif",
  "pau_capell.avif",
  "rory_bosio.avif",
  "vincent_delebarre.avif",
  "xavier_thevenard.avif",
  "marco_olmo.avif",
  "elizabeth_hawker.avif",
]

export {
  organizations,
  sponsors,
  DBSeedUsers,
  DBSeedUserProfiles,
  DBSeedUserProfilePictureUrls,
  DBSeedUserProfilesSponsors,
}