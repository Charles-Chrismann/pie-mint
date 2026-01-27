import Api from "@/Api"
import type { Event, Race } from "@/declarations"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function EventPage() {
  const { eventId } = useParams()
  const [event, setEvent] = useState<Event>()
  const [_races, setRaces] = useState<Race[]>([])

  useEffect(() => {
    async function fetchEvent() {
      const eventData = await Api.getPublic<Event>(`/events/${eventId}`)
      setEvent(eventData)
    }

    fetchEvent()
  }, [])

  useEffect(() => {
    async function fetchRace() {
      const raceDate = await Api.getPublic<Race[]>(`/events/${eventId}/races`)
      setRaces(raceDate)
    }

    fetchRace()
  }, [])

  return (
    <div>
      {
        event &&
        <div>
          {event.name}
        </div>
      }

      {/* <ResponsiveCardGrid children={races.map(se =>
        <RaceCard key={se.id} raceId={se.id} link={`./races/${se.id}`} />
      )} /> */}

      {/* <ul className="flex">
        {
          race.map(se => <RaceCard key={se.id} raceId={se.id} />)
        }
      </ul> */}
    </div>
  )
}