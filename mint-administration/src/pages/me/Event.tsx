import Api from "@/Api"
import ResponsiveCardGrid from "@/components/cards/ResponsiveCardGrid"
import SubEventCard from "@/components/cards/SubEventCard"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import type { Event, SubEvent } from "@/declarations"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function EventPage() {
  const { eventId } = useParams()
  const [event, setEvent] = useState<Event>()
  const [subEvent, setSubEvent] = useState<SubEvent[]>([])
  
  useEffect(() => {
    async function fetchEvent() {
      const eventData = await Api.getPublic<Event>(`/events/${eventId}`)
      setEvent(eventData)
    }

    fetchEvent()
  }, [])

  useEffect(() => {
    async function fetchSuBEvent() {
      const subEventData = await Api.getPublic<SubEvent[]>(`/events/${eventId}/sub-events`)
      setSubEvent(subEventData)
    }

    fetchSuBEvent()
  }, [])

  return (
    <div>
      {
        event &&
        <div>
          {event.name}
        </div>
      }

      <ResponsiveCardGrid children={subEvent.map(se => <SubEventCard key={se.id} subEventId={se.id} />)} />

      {/* <ul className="flex">
        {
          subEvent.map(se => <SubEventCard key={se.id} subEventId={se.id} />)
        }
      </ul> */}
    </div>
  )
}