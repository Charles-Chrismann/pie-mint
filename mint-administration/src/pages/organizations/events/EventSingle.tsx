import Api from "@/Api";
import TrackPreview from "@/components/TrackPreview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Organization, SubEvent, Event, Track, TrackPoint } from "@/declarations";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function EventSinglePage() {
  const { eventId } = useParams();

  const [event, setEvent] = useState<Event>()
  const [subEvents, setSubEvents] = useState<SubEvent[]>([])
  const [tracks, setTracks] = useState<TrackPoint[][]>([])


  useEffect(() => {
    async function fetchEvent() {
      setEvent(await Api.getPublic<Event>(`/events/${eventId}`))
    }
    fetchEvent()
  }, [])

  useEffect(() => {
    async function fetchSubEvents() {
      setSubEvents(await Api.getPublic<SubEvent[]>(`/events/${eventId}/sub-events`))
    }
    fetchSubEvents()
  }, [event])

  useEffect(() => {
    async function fetchSubEventsTrack() {
      const ts = await Promise.all(subEvents.map(se => Api.getPublic<TrackPoint[]>(`/sub-events/${se.id}/track`)))
      setTracks(ts)
    }
    fetchSubEventsTrack()
  }, [subEvents])

  return (
    event ?
      <div>
        <h1>{event.name}</h1>
        <p>{event.start_date}</p>
        <p>{event.end_date}</p>
        <p>{event.description}</p>
        <div>
          <h4>Courses:</h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full px-8">
            {
              subEvents.length ?
                subEvents.map(se =>
                  <li key={se.id}>
                    <Card>
                      <CardHeader>
                        <CardTitle>{se.name}</CardTitle>
                        <CardDescription>
                          <p>Distance: {se.distance}</p>
                          <p>Dénivelé positif: {se.distance}</p>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="w-full aspect-video">
                        {tracks && tracks.find(t => t[0].track_id === se.track_id) && <TrackPreview track={tracks.find(t => t[0].track_id === se.track_id)!} />}
                      </CardContent>
                    </Card>
                  </li>
                ) :
                <div>chargement des courses...</div>
            }
          </ul>
        </div>
      </div> :
      <div>loading....</div>
  )
}