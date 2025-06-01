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
            start_time: new Date("April 26, 2026 9:15:00"),

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
            start_time: new Date("March 30, 2025 7:30:00"),

            track: {
              name: 'La track du LUT 2025 - 37km',
              gpx: 'lut-2025-37km.gpx'
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