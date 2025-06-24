import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import type { SubEvent, Track, TrackPoint } from "@/declarations";
import TrackPreview from "../TrackPreview";
import Api from "@/Api";

export default function SubEventCard({ subEventId }: { subEventId: number }) {

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
          <CardContent className="w-full aspect-video">
            {
              track && <TrackPreview track={track} />
            }
          </CardContent>
        </Card>
      }
    </div>
  )
}