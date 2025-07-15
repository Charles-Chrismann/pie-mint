import Api from "@/Api";
import RaceCard from "@/components/cards/RaceCard";
import ResponsiveCardGrid from "@/components/cards/ResponsiveCardGrid";
import TrackPreview from "@/components/TrackPreview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  Race,
  Event,
  TrackPoint,
  LineString
} from "@/declarations";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EventSinglePage() {
  const { eventId } = useParams();

  const [event, setEvent] = useState<Event>()
  const [races, setRaces] = useState<Race[]>([])
  const [tracks, setTracks] = useState<LineString[]>([])


  useEffect(() => {
    async function fetchEvent() {
      setEvent(await Api.getPublic<Event>(`/events/${eventId}`))
    }
    fetchEvent()
  }, [])

  useEffect(() => {
    async function fetchRaces() {
      setRaces(await Api.getPublic<Race[]>(`/events/${eventId}/races`))
    }
    fetchRaces()
  }, [event])

  useEffect(() => {
    async function fetchRacesTrack() {
      const ts = await Promise.all(races.map(se => Api.getPublic<LineString>(`/races/${se.id}/track`)))
      setTracks(ts)
    }
    fetchRacesTrack()
  }, [races])

  return (
    event ?
      <div>
        <h1>{event.name}</h1>
        <p>{event.start_date}</p>
        <p>{event.end_date}</p>
        <p>{event.description}</p>
        <div>
          <h4>Courses:</h4>
          <ResponsiveCardGrid children={races.map(se =>
                  <RaceCard key={se.id} raceId={se.id} link={`./races/${se.id}`} />
                )} />
          {/* <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full px-8">
            {
              races.length ?
                races.map(se =>
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
          </ul> */}
        </div>
      </div> :
      <div>loading....</div>
  )
}