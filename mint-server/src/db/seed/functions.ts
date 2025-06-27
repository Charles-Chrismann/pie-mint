import { faker } from "@faker-js/faker";
import { hashSync } from 'bcrypt'
import { db } from "..";
import { events_table, organizations_table, standard_distances_table, sub_events_table, track_points_table, track_segments_table, tracks_table, user_profiles_table, users_table } from "../schema";
import { organizations } from "./constants";
import { XMLParser } from "fast-xml-parser";
import * as fs from 'fs/promises'
import { chunkify, getPointsFromGpx } from "../../utils";
import { SeedEventQueryResult } from "./declarations";

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
  const standard_distances = await db.select().from(standard_distances_table)

  const createdOrgs = await db
    .insert(organizations_table)
    .values(
      organizations.map(
        org => ({
          name: org.name,
          created_by_id: 1,
          owner_id: 1
        })
      )
    )
    .returning()

  const values = organizations.map(
    org => org.events.map(
      event => ({
        name: event.name,
        start_date: event.start_date,
        end_date: event.end_date,
        organization_id: (createdOrgs as any).find(co => co.name === org.name)!.id
      })

    )
  ).filter(v => v.length).flat()

  const createdEvents = await db
    .insert(events_table)
    .values(
      values
    )
    .returning() as unknown as SeedEventQueryResult[]

  const createdTracks = await db
    .insert(tracks_table)
    .values(
      organizations.map(
        org => org.events.map(
          evt => evt.sub_events.map(
            se => ({
              name: se.track.name
            })
          )
        )
      ).flat(2)
    )
    .returning()

  const parser = new XMLParser({ ignoreAttributes: false })

  const createdTrackpointLists = await Promise.all(
    organizations.map(org => org.events.map(evt => evt.sub_events.map(async se => {
      if (!se.track.gpx) return

      const track_id = createdTracks.find(ct => ct.name === se.track.name)?.id
      if (!track_id) return

      const gpxStr = await fs.readFile('./src/db/seed/gpxs/' + se.track.gpx)
      const gpxData = parser.parse(gpxStr)
      const points = getPointsFromGpx(gpxData)

      const chunks = chunkify(points, 512)

      return Promise.all(
        chunks.map((chunk, chunkI) =>
          db.insert(track_points_table).values(
            chunk.map((p, i) => ({
              alt: p.alt,
              lat: p.lat,
              lng: p.lng,
              is_first_point: i === 0 && chunkI === 0,
              is_last_point: i === chunk.length - 1 && chunkI === chunks.length - 1,
              track_id,
            }))
          ).returning()
        )
      )
    }))).flat(2)
  )

  const createdTrackpointListsFlat = createdTrackpointLists.map(ctl => ctl ? ctl!.flat() : [])

  const createdSegmentsList = await Promise.all(
    createdTrackpointListsFlat.map((points) => {
      const chunks = chunkify(points, 512)
      return Promise.all(
        chunks.map(
          (chunk, chunkI) => db.insert(track_segments_table).values(
            chunk.map((point, pointI) => {
              let end_position_id: undefined | number
              // si c'est le dernier point du dernier chunk
              if (chunkI === chunks.length - 1 && pointI === chunk.length - 1)end_position_id = undefined
              else {
                // Si y a un point derrière
                if (pointI !== chunk.length - 1) end_position_id = chunk[pointI + 1].id
                else end_position_id = chunks[chunkI + 1][0].id
              }
              return ({
                track_id: point.track_id,
                start_position_id: point.id,
                end_position_id
              })
            })).returning()
        ))
    })
  )

  const createdSubEvents = await db.insert(sub_events_table).values(
    organizations.map(org => org.events.map(evt => evt.sub_events.map(se => ({
      name: se.name,
      distance: se.distance,
      positiveElevation: se.positive_elevation,

      standard_distance_id: standard_distances.find(sd => sd.name === se.standard_distance)?.id,
      event_id: createdEvents!.find(e => e.name === evt.name)!.id,
      track_id: createdTracks!.find(t => t.name === se.track.name)!.id,
    })))).flat(2)
  )
    .returning()
}

export {
  seedUsersAndUserProfiles,
  seedOriganizations
}