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

      <RacesStatus />
    </div>
  )
}