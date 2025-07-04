import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import type { SubEvent, Track, TrackPoint } from "@/declarations";
import TrackPreview from "../TrackPreview";
import Api from "@/Api";
import { Link } from "react-router-dom";

export default function SubEventCard({ subEventId, link = '#' }: { subEventId: number, link?: string }) {

  const [loading, setLoading] = useState(true)
  const [subEvent, setSubEvent] = useState<SubEvent>()
  const [track, setTrack] = useState<TrackPoint[]>()

  useEffect(() => {
    async function fetchSubEvent() {
      setSubEvent(await Api.getPublic<SubEvent>(`/sub-events/${subEventId}`))
    }

    fetchSubEvent()
  }, [])

  useEffect(() => {
    async function fetchTrack() {
      setTrack(await Api.getPublic<TrackPoint[]>(`/sub-events/${subEventId}/track`))
    }

    fetchTrack()
  }, [])

  return (
    // !subEvent ?
    // <div>
    //   loading
    // </div> :
    <div>
      <Link to={link}>
        {
          subEvent &&
          <Card>
            <CardHeader>
              <CardTitle>{subEvent.name}</CardTitle>
              <CardDescription>
                <p>Distance: {subEvent.distance}</p>
                <p>Dénivelé positif: {subEvent.positive_elevation}</p>
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full aspect-video" onClick={(e) => e.preventDefault()}>
              {
                track && <TrackPreview track={track} />
              }
            </CardContent>
          </Card>
        }
      </Link>
    </div>
  )
}