import { faker } from "@faker-js/faker";
import { hashSync } from 'bcrypt'
import { db } from "./seedDB";
import { event_campaigns_table, events_table, organizations_table, standard_distances_table, race_start_waves_table, races_table, track_segments_table, tracks_table, user_profiles_table, users_table, registrations_table, countries_table, medias_table } from "../schema";
import { organizations } from "./constants";
import { XMLParser } from "fast-xml-parser";
import * as fs from 'fs/promises'
import { chunkify, getPointsFromGpx } from "../../utils";
import { SeedEventQueryResult } from "./declarations";
import { eq, sql } from "drizzle-orm";

async function getPPUrls(url: string, count = 1) {

  const now = Date.now()

  if(count === 1) {
    const completeUrl = url.replace('REPLACE_TIME', String(now))
    const res = await fetch(url)
    const data: { src: string } = await res.json()
    return [`https://this-person-does-not-exist.com${data.src}`]
  }

  const ress = await Promise.all(Array.from({ length: count }).map((_, i) => fetch(url.replace('REPLACE_TIME', String(now - 60000 * i)))))

  const datas: string[] = (await Promise.all(ress.map(r => r.json()))).map(i => `https://this-person-does-not-exist.com${i.src}`)

  return datas
}

async function seedUsersAndUserProfiles({ count }: { count: number }) {

  const passwordHash = hashSync('password', 8)

  const user = (await db.insert(users_table).values({ email: "user@example.com", password: passwordHash }).returning())[0]
  const [mpps, fpps] = await Promise.all([
    getPPUrls(`https://this-person-does-not-exist.com/new?time=REPLACE_TIME&gender=male&age=26-35&etnic=all`, 10),
    getPPUrls(`https://this-person-does-not-exist.com/new?time=REPLACE_TIME&gender=female&age=26-35&etnic=all`, 10),
  ])
  const createdUserProfileAvatarMedia = (await db.insert(medias_table).values({url: 'https://avatars.githubusercontent.com/u/78157563?v=4', is_system: false}).returning())[0]
  const createdUserProfileBannerMedia = (await db.insert(medias_table).values({url: 'https://raw.githubusercontent.com/Charles-Chrismann/Charles-Chrismann/main/assets/mint/caroussel.png', is_system: false}).returning())[0]
  await db.insert(user_profiles_table).values({ 
    user_id: user.id,
    firstname: "Charles",
    lastname: "Chrismann",
    avatar_media_id: createdUserProfileAvatarMedia.id,
    banner_media_id: createdUserProfileBannerMedia.id,
    country_id: 1
  })

  const countries = await db.select({ id: countries_table.id }).from(countries_table)

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

  const createdUserProfileAvatarMedias = await Promise.all(
    generatedUsers.map(gup => {
      const ppsList = (Math.random() < .5 ? mpps : fpps)
      return db.insert(medias_table).values({url: ppsList[Math.floor(Math.random()*ppsList.length)], is_system: false}).returning()
    })
  )

  const generatedUserProfiles = await Promise.all(
    generatedUsers.map(
      ({ id, email }, i) => {
        const { firstname, lastname } = fakeUsers.find(u => u.email === email)!

        return db.insert(user_profiles_table).values({ user_id: id, firstname, lastname, avatar_media_id: createdUserProfileAvatarMedias[i][0].id, country_id: countries[Math.floor(Math.random()*countries.length)].id })
      }
    )
  )
}

async function seedOriganizations({ count }: { count: number }) {
  const standard_distances = await db.select().from(standard_distances_table)

  const createdOrgs: any[] = await db
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
    .returning() as any[]

  const createdEventCampaigns = await db
    .insert(event_campaigns_table)
    .values(
      organizations.map(org => org.events.map(evt => evt.event_campaign ?? [])).flat(2)
    )
    .returning()

  const values = organizations.map(
    org => org.events.map(
      event => ({
        name: event.name,
        start_date: event.start_date,
        end_date: event.end_date,
        organization_id: (createdOrgs as any).find(co => co.name === org.name)!.id,
        event_campaign_id: event.event_campaign ? createdEventCampaigns.find(cec => cec.name === event.event_campaign!.name)!.id : undefined
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
          evt => evt.races.map(
            se => ({
              name: se.track.name
            })
          )
        )
      ).flat(2)
    )
    .returning()

  const parser = new XMLParser({ ignoreAttributes: false })

  //   await db.insert(track_points_table).values({
  //               location: sql`ST_SetSRID(ST_MakePoint(-90.99999999999999, 18.7, 150), 4326)`,
  //               is_first_point: true,
  //               is_last_point: true,
  //               track_id: 1,
  // }).returning()

  // const createdTrackpointLists = await Promise.all(
  //   organizations.map(org => org.events.map(evt => evt.races.map(async se => {
  //     if (!se.track.gpx) return

  //     const track_id = createdTracks.find(ct => ct.name === se.track.name)?.id
  //     if (!track_id) return

  //     const gpxStr = await fs.readFile('./src/db/seed/gpxs/' + se.track.gpx)
  //     const gpxData = parser.parse(gpxStr)
  //     const points = getPointsFromGpx(gpxData)

  //     const chunks = chunkify(points, 256)

  //     return Promise.all(
  //       chunks.map((chunk, chunkI) =>
  //         db.insert(track_points_table).values(
  //           chunk.map((p, i) => ({
  //             location: sql`ST_SetSRID(ST_MakePoint(${p.lng}, ${p.lat}, ${p.alt}), 4326)`,
  //             is_first_point: i === 0 && chunkI === 0,
  //             is_last_point: i === chunk.length - 1 && chunkI === chunks.length - 1,
  //             track_id,
  //           }))
  //         ).returning()
  //       )
  //     )
  //   }))).flat(2)
  // )

  // const createdTrackpointListsFlat = createdTrackpointLists.map(ctl => ctl ? ctl!.flat() : [])

  // const createdSegmentsList = await Promise.all(
  //   createdTrackpointListsFlat.map((points) => {
  //     const chunks = chunkify(points, 256)
  //     return Promise.all(
  //       chunks.map(
  //         (chunk, chunkI) => db.insert(track_segments_table).values(
  //           chunk.map((point: any, pointI) => {
  //             // let end_position_id: undefined | number
  //             // // si c'est le dernier point du dernier chunk
  //             // if (chunkI === chunks.length - 1 && pointI === chunk.length - 1) end_position_id = undefined
  //             // else {
  //             //   // Si y a un point derrière
  //             //   if (pointI !== chunk.length - 1) end_position_id = chunk[pointI + 1].id
  //             //   else end_position_id = chunks[chunkI + 1][0].id
  //             // }
  //             return ({
  //               track_id: point.track_id,
  //               segment: 'LINESTRINGZ(1.5 45.5 120, 1.51 45.51 140, 1.52 45.52 135)',
  //               segmentIndex: 1,
  //               // start_position_id: point.id,
  //               // end_position_id
  //             })
  //           })).returning()
  //       ))
  //   })
  // )

  const createdTrackSegments = await Promise.all(
    organizations.map(org => org.events.map(evt => evt.races.map(async se => {
      if (!se.track.gpx) return

      const track_id = createdTracks.find(ct => ct.name === se.track.name)?.id
      if (!track_id) return

      const gpxStr = await fs.readFile('./src/db/seed/gpxs/' + se.track.gpx)
      const gpxData = parser.parse(gpxStr)
      const points = getPointsFromGpx(gpxData)

      return db.insert(track_segments_table).values({
        track_id,
        segment_index: 1,
        segment: `LINESTRINGZ(${points.map(p => `${Number(p.lng.toFixed(8))} ${Number(p.lat.toFixed(8))} ${Number(p.alt.toFixed(8))}`).join(',')})`,
      })
    })))
  )

  // await db.insert(track_segments_table).values({
  //   track_id: 1,
  //   segmentIndex: 1,
  //   segment: 'LINESTRINGZ(1.5 45.5 120, 1.51 45.51 140, 1.52 45.52 135)',
  // })

  const createdRaces = await db.insert(races_table).values(
    organizations.map(org => org.events.map(evt => evt.races.map(se => ({
      name: se.name,
      distance: se.distance,
      positive_elevation: se.positive_elevation,
      start_date: evt.start_date,
      standard_distance_id: standard_distances.find(sd => sd.name === se.standard_distance)?.id,
      race_discipline_id: se.race_discipline_id,

      track_id: createdTracks!.find(t => t.name === se.track.name)!.id,
      event_id: createdEvents!.find(e => e.name === evt.name)!.id,
      organization_id: createdOrgs.find(o => o.name === org.name)!.id,
      created_by_id: 1
    })))).flat(2)
  ).returning() as any[]

  const createdStartWaves = await db
    .insert(race_start_waves_table)
    .values(
      organizations.map(org => org.events.map(evt => evt.races.map(se => {
        const correspondingCreatedRaceId: number = createdRaces.find(cse => cse.name === se.name)!.id
        return se.start_waves ? se.start_waves.map(sw => ({
          ...sw,
          race_id: correspondingCreatedRaceId
        })) : []
      }))).flat(3)
    )
    .returning()
}

async function seedRegistrations() {
  const users = await db.select().from(user_profiles_table)
  const lut2025 = (await db.select().from(races_table).where(eq(races_table.name, 'Lyon Urban Trail 2025')).limit(1))[0]!

  const createdRegistrations = await db
  .insert(registrations_table)
  .values(users.map(u => ({
    race_id: 1,
    user_profile_id: u.id,
    bib_alias: u.firstname,
    bib_number: u.id
  })))
}

export {
  seedUsersAndUserProfiles,
  seedOriganizations,
  seedRegistrations,
}