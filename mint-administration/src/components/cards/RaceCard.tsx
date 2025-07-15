import {
  useEffect,
  useState
} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../ui/card";
import type {
  LineString,
  Race,
  TrackPoint
} from "@/declarations";
import TrackPreview from "../TrackPreview";
import Api from "@/Api";
import { Link } from "react-router-dom";

export default function RaceCard({ raceId, link = '#' }: { raceId: number, link?: string }) {

  const [_loading, _setLoading] = useState(true)
  const [race, setRace] = useState<Race>()
  const [track, setTrack] = useState<LineString>()

  useEffect(() => {
    async function fetchRace() {
      setRace(await Api.getPublic<Race>(`/races/${raceId}`))
    }

    fetchRace()
  }, [])

  useEffect(() => {
    async function fetchTrack() {
      setTrack(await Api.getPublic<LineString>(`/races/${raceId}/track`))
    }

    fetchTrack()
  }, [])

  return (
    // !race ?
    // <div>
    //   loading
    // </div> :
    <div>
      <Link to={link}>
        {
          race &&
          <Card>
            <CardHeader>
              <CardTitle>{race.name}</CardTitle>
              <CardDescription>
                <p>Distance: {race.distance}</p>
                <p>Dénivelé positif: {race.positive_elevation}</p>
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