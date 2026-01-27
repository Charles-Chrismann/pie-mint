import CreateRaceCard from "@/components/cards/CreateRaceCard"
import EmulateCard from "@/components/EmulateCard"
import RacesStatus from "@/components/RacesStatus"
import { useRaces } from "@/contexts/RacesContext"
import { useEffect } from "react"

export default function HomePage() {
  const { refreshRaces } = useRaces()

	useEffect(() => {
		refreshRaces()
	}, [])

  return (
    <div>
      <EmulateCard />
      <CreateRaceCard />

      <RacesStatus />
    </div>
  )
}