import {
  useRef,
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
  MergedRace,
} from "@/declarations";
import TrackPreview from "../TrackPreview";
import { gpxToLineString } from "@/lib/utils";
import { renderRaceStatus } from "@/lib/utilsTsx";
import { feature, length } from "@turf/turf";

export default function RaceCard({ race }: { race: MergedRace }) {
  if(!race._api) return <div></div>

  const [_loading, _setLoading] = useState(true)
  // const [race, setRace] = useState<Race>()
  const track = useRef(
    race._api
      ? feature(gpxToLineString(race._api.gpxFile))
      : undefined
  );
  
  const distance = useRef(
    track.current ? length(track.current) : undefined
  );

  // useEffect(() => {
  //   async function fetchRace() {
  //     setRace(await Api.getPublic<Race>(`/races/${raceId}`))
  //   }

  //   fetchRace()
  // }, [])

  // useEffect(() => {
  //   async function fetchTrack() {
  //     setTrack(await Api.getPublic<LineString>(`/races/${raceId}/track`))
  //   }

  //   fetchTrack()
  // }, [])

  return (
    // !race ?
    // <div>
    //   loading
    // </div> :
    <div>
      {/* <Link to={link}> */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                  <span>{race._api?.name} ({race.id})</span>
                  {renderRaceStatus(race.startDate, race.endDate)}
                </CardTitle>
              <CardDescription>
                <p>Distance: {distance.current}</p>
                {/* <p>Dénivelé positif: {race.positive_elevation}</p> */}
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full aspect-video" onClick={(e) => e.preventDefault()}>
              {
                track.current && <TrackPreview track={track.current.geometry} />
              }
            </CardContent>
          </Card>
      {/* </Link> */}
    </div>
  )
}