import Api from "@/Api"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import type {
  LastUpdatedRunner,
  MapStyleKey,
  Runner,
  Race,
  LineString,
  Registration
} from "@/declarations"
import {
  useEffect,
  useState
} from "react"
import { socket } from '../../socket'
import LeafletMap from "@/LeafletMap"
import { MAP_STYLES } from "@/constants"
import config from "@/config"

export default function EmulateRunPage() {
  const [_isConnected, setIsConnected] = useState(socket.connected);
  const [_Races, setRaces] = useState<Race[]>([])
  const [raceRunners, setRaceRunners] = useState<Registration[]>([])
  const [selectedRunner, setSelectedRunner] = useState<Registration>()
  const [track, setTrack] = useState<LineString[]>()
  const [lastUpdatedRunners, setLastUpdatedRunners] = useState<LastUpdatedRunner[]>()
  const [mapStyle, setMapStyle] = useState<{name: MapStyleKey, tileLayer: L.TileLayer}>({name: "default", tileLayer: MAP_STYLES.default})

  useEffect(() => {
    async function fetchRaces() {
      setRaces(await Api.getPublic('/races'))
    }

    fetchRaces()
  }, [])

  useEffect(() => {
    async function fetchRunners() {
      setRaceRunners(await Api.getPublic<Registration[]>('/races/1/runners'))
    }

    fetchRunners()
  }, [])

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      socket.emit('spec')
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onPosition(data: Runner[]) {
      console.log(data)
      setLastUpdatedRunners(data.map(r => ({
        runner_id: r.runner_id,
        name: r.name,
        position: {
          lat: r.position.lat,
          lng: r.position.lng,
        },
        rank: r.rank
      })))
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('positions', onPosition)

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('positions', onPosition)
    };
  }, []);

  // async function fetchRaceRunners(raceId: string) {
  //   setRaceRunners(await Api.getPublic<RaceRegistrationRunners[]>(`/races/${raceId}/runners`))
  // }

  function changeMapStyle(e: MapStyleKey) {
    setMapStyle({name: e, tileLayer: MAP_STYLES[e] })
  }

  useEffect(() => {
    async function loadTrack() {
      const res = await fetch(config.API_BASE_URL + '/races/1/track')
      const data = await res.json()
      
      setTrack(data)
    }

    loadTrack()

  }, [])

  return (
    <div className="h-full flex">
      {/* <div className="flex justify-between p-4">
        <Select onValueChange={e => fetchRaceRunners(e)}>
          <SelectTrigger className="w-[360px]">
            <SelectValue placeholder="Selectionner un évènement" />
          </SelectTrigger>
          <SelectContent>
            {
              races.map(se => <SelectItem value={String(se.id)}>{se.name}</SelectItem>)
            }
          </SelectContent>
        </Select>
          <span>{raceRunners.length} runner</span>
      </div> */}
      <div className="relative h-full w-full">
        <div className="absolute right-4 top-4 z-9999 bg-white">
          <Select
            value={mapStyle.name}
            onValueChange={changeMapStyle}
          >
            <SelectTrigger className="w-[360px]">
              <SelectValue placeholder="Selectionner un évènement" />
            </SelectTrigger>
            <SelectContent  className="z-[99999]">
              {
                Object.keys(MAP_STYLES).map((key) => <SelectItem key={key} value={key}>{key}</SelectItem>)
              }
            </SelectContent>
          </Select>
        </div>
        <LeafletMap
          track={track}
          lastUpdatedRunners={lastUpdatedRunners}
          mapStyle={mapStyle.tileLayer}
          raceRunners={raceRunners}
          setSelectedRunner={setSelectedRunner}
          />
      </div>

      {
        selectedRunner &&
        <div className="w-128 flex flex-col gap-2">
          <div className="relative w-full h-64">
            <img
              src={selectedRunner.user_profile.banner_url}
              alt={`${selectedRunner.user_profile.firstname} ${selectedRunner.user_profile.lastname}'s banner`}
              className="absolute w-full h-1/2 object-cover left-0 top-0"
            />
            <img
              src={selectedRunner.user_profile.avatar_url}
              alt={`${selectedRunner.user_profile.firstname} ${selectedRunner.user_profile.lastname}'s avatar`}
              className="absolute w-48 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 outline outline-8 outline-white"
            />
          </div>
          <h2
            className="font-bold text-center"
          >{selectedRunner.user_profile.firstname} {selectedRunner.user_profile.lastname}</h2>

          {
            lastUpdatedRunners && lastUpdatedRunners.length && 
            <p>Position: <span className="font-bold">{ lastUpdatedRunners.find(r => r.runner_id === selectedRunner.bib_number)?.rank }</span></p>
          }

          <p>Dossard: </p>

          <div className="grid place-items-center">
            <div className="flex flex-col gap-2 items-center justify-center border-1 border-black p-[2px] aspect-video w-48">
              <p className="font-bold">{selectedRunner.bib_number}</p>
              <p className="font-bold">{selectedRunner.flag_emoji} {selectedRunner.bib_alias} {selectedRunner.flag_emoji}</p>
            </div>
          </div>

        </div>
      }
    </div>
  )
}