import { eq } from "drizzle-orm"
import { db } from "../../../mint-server/src/db"
import { user_profiles_table, races_table } from "../../../mint-server/src/db/schema"

async function createRaceSoon() {

	const results = await db.transaction(async tx => {

		const me = (await tx.select().from(user_profiles_table).where(eq(user_profiles_table.user_id, 1)).limit(1))[0]
	
		const start_date = new Date(Date.now() + 2 * 60 * 1000)
	
		const createdRace = tx.insert(races_table)
		.values({
			name: "Course de démo",
			start_date,
			created_by_id: me.user_id,
		})
	})

}

createRaceSoon()