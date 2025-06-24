import { seedOriganizations, seedUsersAndUserProfiles } from "./functions"

async function main() {
  const now = performance.now()
  console.log(`Seeding database...`)

  const options = {
    counts: {
      users: +process.env.SEED_USER_COUNT! as number || 10_000
    }
  }

  await seedUsersAndUserProfiles({count: options.counts.users})
  await seedOriganizations({count: options.counts.users})

  console.log(`Database seeded in: ${performance.now() - now} ms`)
}

main()