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
  Race,
  LineString,
  Registration,
  Runner
} from "@/declarations"
import {
  useEffect,
  useState
} from "react"
import { socket } from '../../socket'
import LeafletMap from "@/LeafletMap"
import { MAP_STYLES } from "@/constants"
import Ws from "@/Ws"
import { useNavigate, useParams } from "react-router-dom"

export default function EmulateRunPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [_isConnected, setIsConnected] = useState(socket.connected);
  const [races, setRaces] = useState<Race[]>([])
  const [selectedRace, setSelectedRace] = useState<Race | null>(null)
  const [raceRunners, _setRaceRunners] = useState<Registration[]>([])
  const [selectedRunner, _setSelectedRunner] = useState<Registration>()
  const [track, setTrack] = useState<LineString>()
  const [lastUpdatedRunners, setLastUpdatedRunners] = useState<LastUpdatedRunner[]>()
  const [ranking, setRanking] = useState<[string, number][]>([])
  const [mapStyle, setMapStyle] = useState<{name: MapStyleKey, tileLayer: L.TileLayer}>({name: "light", tileLayer: MAP_STYLES.light()})
  const [runners, setRunners] = useState<Runner[]>([])

  useEffect(() => {
    async function fetchRaces() {
      const races = await Ws.getRunningRaces()
      setRaces(races)
      if(id) {
        const selected = races.find(r => r.id === id)
        if(selected) {
          setSelectedRace(selected)
          setTrack(selected.geometry)
        }
      }
    }
    
    if(id) {
      socket.emit('join-race', id)
    }
    fetchRaces()

    return () => {
      socket.emit('leave-race', id)
    }
  }, [])

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      socket.emit('spec')
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onPosition(data: { positions: [string, number, number, number][], ranking: [string, number][] }) {
      // setLastUpdatedRunners(data.map(r => ({
      //   runner_id: r.runner_id,
      //   name: r.name,
      //   position: {
      //     lat: r.position.lat,
      //     lng: r.position.lng,
      //   },
      //   rank: r.rank
      // })))
      
      const { positions, ranking } = data
      setRanking(ranking)
      setLastUpdatedRunners(positions.map(d => ({ userId: d[0], lon: d[1], lat: d[2], alt: d[3] })))
    }

    function onAddedRace(data: Race) {
      setRaces(prev => [...prev, data])
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('positions', onPosition)
    socket.on('added-race', onAddedRace)

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('positions', onPosition);
      socket.off('added-race', onAddedRace);
    };
  }, []);

  // async function fetchRaceRunners(raceId: string) {
  //   setRaceRunners(await Api.getPublic<RaceRegistrationRunners[]>(`/races/${raceId}/runners`))
  // }

  function changeMapStyle(e: MapStyleKey) {
    setMapStyle({name: e, tileLayer: MAP_STYLES[e]() })
  }

  function handleRaceChange(raceId: string) {
    if(selectedRace && selectedRace.id !== raceId) {
      socket.emit('leave-race', selectedRace.id)
    }
    socket.emit('join-race', raceId)
    const race = races.find(r => r.id === raceId)!
    for(const runner of runners) {
      runner.marker.remove()
    }
    setSelectedRace(race)
    navigate(`/races/${race.id}`, { replace: true });
    setTrack(race.geometry)
    setRanking([])
    setRunners([])
  }

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
        <div className="absolute right-4 top-4 z-9999 bg-transparent">
          <Select
            value={mapStyle.name}
            onValueChange={changeMapStyle}
          >
            <SelectTrigger className="w-[360px] bg-white">
              <SelectValue placeholder="Selectionner un évènement" />
            </SelectTrigger>
            <SelectContent  className="z-[99999]">
              {
                Object.keys(MAP_STYLES).map((key) => <SelectItem key={key} value={key}>{key}</SelectItem>)
              }
            </SelectContent>
          </Select>
          <Select
            value={selectedRace?.id}
            onValueChange={handleRaceChange}
          >
            <SelectTrigger className="w-[360px] bg-white">
              <SelectValue placeholder="Selectionner une course" />
            </SelectTrigger>
            <SelectContent  className="z-[99999]">
              {
                races.map((race) => <SelectItem key={race.id} value={race.id}>{race.id}</SelectItem>)
              }
            </SelectContent>
          </Select>
          {
            !!ranking.length &&
            <ul className="ranking flex flex-col bg-white">
              {
                ranking.map(([userId, progress], i) => (
                  <li
                    style={{
                      color: runners.find(r => r.userId === userId)?.color || "blue"
                    }}
                    >{i + 1}. {userId}: {progress === -1 ? "🏁" : progress}</li>
                ))
              }
            </ul>
          }
        </div>
        <LeafletMap
          track={track}
          lastUpdatedRunners={lastUpdatedRunners}
          mapStyle={mapStyle.tileLayer}
          raceRunners={raceRunners}
          runners={runners}
          setRunners={setRunners}
          // setSelectedRunner={setSelectedRunner}
          />
      </div>

      {
        selectedRunner &&
        <div className="w-128 flex flex-col gap-2">
          <div className="relative w-full h-64">
            <img
              src={undefined}
              alt={`${selectedRunner.user_profile.firstname} ${selectedRunner.user_profile.lastname}'s banner`}
              className="absolute w-full h-1/2 object-cover left-0 top-0"
            />
            <img
              src={undefined}
              alt={`${selectedRunner.user_profile.firstname} ${selectedRunner.user_profile.lastname}'s avatar`}
              className="absolute w-48 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 outline outline-8 outline-white"
            />
          </div>
          <h2
            className="font-bold text-center"
          >{selectedRunner.user_profile.firstname} {selectedRunner.user_profile.lastname}</h2>

          {
            lastUpdatedRunners && lastUpdatedRunners.length && <></>
            // <p>Position: <span className="font-bold">{ lastUpdatedRunners.find(r => r.runner_id === selectedRunner.bib_number)?.rank }</span></p>
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