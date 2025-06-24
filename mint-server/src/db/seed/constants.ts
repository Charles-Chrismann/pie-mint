import { Organization } from "./declarations"

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

        sub_events: [
          {
            name: 'Marathon',
            standard_distance: 'Marathon',

            track: {
              name: 'La track du marathon de Nantes 2026',
            }
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

        sub_events: [
          {
            name: 'Le 37km',
            distance: "37000",
            positive_elevation: "1500",

            track: {
              name: 'La track du LUT 2025 - 37km',
              gpx: 'lut-2025-37km.gpx'
            }
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

        sub_events: [
          {
            name: 'Ultra du Saint Jacques - 100M',
            distance: "134000",
            positive_elevation: "6050",

            track: {
              name: 'Ultra du Saint Jacques - 100M',
              gpx: 'tsj_25_ultra_9dcb2f834c.gpx'
            }
          },
          {
            name: 'Grand Trail du Saint Jacques - 100K',
            distance: "81000",
            positive_elevation: "3400",

            track: {
              name: 'Grand Trail du Saint Jacques - 100K',
              gpx: 'tsj_25_grand_trail_c98365eb07.gpx'
            }
          },
          {
            name: 'Monistrail - 50K',
            distance: "54000",
            positive_elevation: "2050",

            track: {
              name: 'Monistrail - 50K',
              gpx: 'tsj_25_monistrail_9974f56408.gpx'
            }
          },
          {
            name: 'Les Chibottes - 20K',
            distance: "26000",
            positive_elevation: "750",

            track: {
              name: 'Les Chibottes - 20K',
              gpx: 'tsj25_chibottes_a16cd32812.gpx'
            }
          },
          {
            name: 'Le 12 du Dolaizon',
            distance: "12000",
            positive_elevation: "210",

            track: {
              name: 'Le 12 du Dolaizon',
              gpx: 'tsj25_petit_parcours_19924150_1737477398_578_a538ae0a86.gpx'
            }
          },
          {
            name: 'Rando 26km',
            distance: "26000",
            positive_elevation: "750",

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
        sub_events: [
          {
            name: "GRV - 100M",
            distance: "124000",
            positive_elevation: "6500",
            track: {
              name: "GRV - 100M",
              gpx: "GRV_100_M_3130c5bfc9.gpx"
            }
          },
          {
            name: "GRV - 100K",
            distance: "89000",
            positive_elevation: "4600",
            track: {
              name: "GRV - 100K",
              gpx: "GRV_100_K_d7ac898f01.gpx"
            }
          },
          {
            name: "GRV - 50K",
            distance: "49000",
            positive_elevation: "2200",
            track: {
              name: "GRV - 50K",
              gpx: "GRV_50_K_8a5d694e54.gpx"
            }
          },
          {
            name: "GRV - 20K",
            distance: "28000",
            positive_elevation: "1200",
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
        sub_events: [
          {
            name: "UTC100M",
            distance: "110000",
            positive_elevation: "7200",
            track: {
              name: "UTC100M",
              gpx: "UTC_2025_d905fb7c2a.gpx"
            }
          },
          {
            name: "RT100K",
            distance: "67000",
            positive_elevation: "3900",
            track: {
              name: "RT100K",
              gpx: "RT_2025_47643f828c.gpx"
            }
          },
          {
            name: "TT50K",
            distance: "33000",
            positive_elevation: "2400",
            track: {
              name: "TT50K",
              gpx: "TT_2025_70d0b03ccb.gpx"
            }
          },
          {
            name: "GT20K",
            distance: "17000",
            positive_elevation: "650",
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

export {
  organizations
}