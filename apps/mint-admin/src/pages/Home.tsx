import CreateRaceCard from "@/components/cards/CreateRaceCard"
import EmulateCard from "@/components/EmulateCard"
import RacesStatus from "@/components/RacesStatus"

export default function HomePage() {

  return (
    <div>
      <EmulateCard />
      <CreateRaceCard />

      <RacesStatus />
    </div>
  )
}