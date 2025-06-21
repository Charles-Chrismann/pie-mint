import { faker } from "@faker-js/faker";
import { hashSync } from 'bcrypt'
import { db } from "..";
import { events_table, organizations_table, standard_distances_table, sub_events_table, track_points_table, track_segments_table, tracks_table, user_profiles_table, users_table } from "../schema";
import { organizations } from "./constants";
import { XMLParser } from "fast-xml-parser";
import * as fs from 'fs/promises'
import { getPointsFromGpx } from "../../utils";

async function seedUsersAndUserProfiles({ count }: { count: number }) {

  const passwordHash = hashSync('password', 12)

  const user = (await db.insert(users_table).values({ email: "user@example.com", password: passwordHash }).returning())[0]
  await db.insert(user_profiles_table).values({ user_id: user.id, firstname: "user", lastname: "user" })

  const fakeUsers = Array.from({ length: count - 1 }).map(
    (_, i) => {

      const FakerFirstName = faker.person.firstName()
      const FakerLastName = faker.person.lastName()

      const FakerEmail = faker.internet.email({
        firstName: FakerFirstName,
        lastName: FakerLastName
      })

      return ({
        firstname: FakerFirstName,
        lastname: FakerLastName,
        email: FakerEmail,
        password: passwordHash
      })
    }
  )

  const generatedUsers = (await Promise.all(
    fakeUsers.map(({ email, password }) => db.insert(users_table).values({ email, password }).returning())
  )).flat(1)

  const generatedUserProfiles = await Promise.all(
    generatedUsers.map(
      ({ id, email }) => {
        const { firstname, lastname } = fakeUsers.find(u => u.email === email)!

        return db.insert(user_profiles_table).values({ user_id: id, firstname, lastname })
      }
    )
  )
}

async function seedOriganizations({ count }: { count: number }) {
  const users = await db.select().from(user_profiles_table)
  const standard_distances = await db.select().from(standard_distances_table)

  for (const org of organizations) {
    const createdOrg = (await db.insert(organizations_table).values({ name: org.name, created_by_id: 1, owner_id: 1 }).returning())[0]

    for (const event of org.events) {
      const createdEvent = (await db.insert(events_table).values({ name: event.name, start_date: event.start_date, end_date: event.end_date, organization_id: createdOrg.id }).returning())[0]

      for (const sub of event.sub_events) {
        const createdTrack = (await db.insert(tracks_table).values({
          name: sub.track.name
        }).returning())[0]

        if (sub.track.gpx) {
          const gpxStr = await fs.readFile('./src/db/seed/gpxs/' + sub.track.gpx)
          const parser = new XMLParser({ ignoreAttributes: false })
          const gpxData = parser.parse(gpxStr)
          const points = getPointsFromGpx(gpxData)
          // .slice(0, 100)

          // await db.insert(track_points_table).values({
          //   alt: 0,
          //   lat: 0,
          //   lng: 0,
          //   track_id: createdTrack.id,
          //   in_track_id: 0,
          //   in_track_previous_id: 0
          // })

          // await db.insert(track_points_table).values({
          //   alt: points[0].alt,
          //   lat: points[0].lat,
          //   lng: points[0].lng,
          //   track_id: createdTrack.id,
          //   in_track_id: 0 + 1,
          //   in_track_previous_id: 0 === 0 ? null : 0
          // })

          // await db.insert(track_points_table).values({
          //   alt: points[1].alt,
          //   lat: points[1].lat,
          //   lng: points[1].lng,
          //   track_id: createdTrack.id,
          //   in_track_id: 1 + 1,
          //   in_track_previous_id: 1
          // })

          // await db.insert(track_points_table).values({
          //   alt: points[2].alt,
          //   lat: points[2].lat,
          //   lng: points[2].lng,
          //   track_id: createdTrack.id,
          //   in_track_id: 2 + 1,
          //   in_track_previous_id: 2
          // })

          // console.log('fffff')

          // await db.insert(track_points_table).values({
          //   alt: points[2].alt,
          //   lat: points[2].lat,
          //   lng: points[2].lng,
          //   track_id: createdTrack.id,
          //   in_track_id: 3 + 1,
          //   in_track_previous_id: 2
          // })

          // console.log(points)

          const createdPoints = (await Promise.all(
            points.map((p, i) => db.insert(track_points_table).values({
              alt: p.alt,
              lat: p.lat,
              lng: p.lng,
              is_first_point: i === 0,
              is_last_point: i === points.length - 1,
              track_id: createdTrack.id,
            }).returning())
          )).flat()

          // console.log(createdPoints)

          const createdSegments = await Promise.all(
            createdPoints.map((p, i) => {
              if(i === createdPoints.length - 1) return

              return db.insert(track_segments_table).values({
                track_id: createdTrack.id,

                start_position_id: p.id,
                end_position_id: createdPoints[i + 1].id
              }).returning()
            })
          )
        }

        const createdSubEvent = await db.insert(sub_events_table).values({
          name: sub.name,
          distance: sub.distance,
          positiveElevation: sub.positive_elevation,

          standard_distance_id: standard_distances.find(sd => sd.name === sub.standard_distance)?.id,
          event_id: createdEvent.id,
          track_id: createdTrack.id
        })


      }
    }
  }
}

export {
  seedUsersAndUserProfiles,
  seedOriganizations
}