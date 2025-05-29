import { db } from "."

interface SeedOrganization {
  name: string
}

async function main() {
  const standard_distances: SeedOrganization[] = [
    
  ]

  for (const d of standard_distances) {
    await db.insert(standard_distances_table).values({name: d[0], distance: d[1]})
  }
}

main()