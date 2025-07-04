import Api from "@/Api"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { LastUpdatedRunner, MapStyleKey, Runner, SubEvent, SubEventRegistrationRunners, Track, TrackPoint } from "@/declarations"
import { useEffect, useState } from "react"
import { socket } from '../../socket'
import LeafletMap from "@/LeafletMap"
import { MAP_STYLES } from "@/constants"

export default function EmulateRunPage() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [subEvents, setSubEvents] = useState<SubEvent[]>([])
  const [subEventRunners, setSubEventRunners] = useState<SubEventRegistrationRunners[]>([])
  const [track, setTrack] = useState<TrackPoint[]>()
  const [lastUpdatedRunner, setLastUpdatedRunner] = useState<LastUpdatedRunner>()
  const [mapStyle, setMapStyle] = useState<{name: MapStyleKey, tileLayer: L.TileLayer}>({name: "default", tileLayer: MAP_STYLES.default})

  useEffect(() => {
    async function fetchSubEvents() {
      setSubEvents(await Api.getPublic('/sub-events'))
    }

    fetchSubEvents()
  }, [])

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onPosition(data: Runner) {
      setLastUpdatedRunner({
        name: data.name,
        position: {
          lat: data.position.lat,
          lng: data.position.lng,
        }
      })
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('position', onPosition)

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('position', onPosition)
    };
  }, []);

  async function fetchSubEventRunners(subEventId: string) {
    setSubEventRunners(await Api.getPublic<SubEventRegistrationRunners[]>(`/sub-events/${subEventId}/runners`))
  }

  function changeMapStyle(e: MapStyleKey) {
    setMapStyle({name: e, tileLayer: MAP_STYLES[e] })
  }

  useEffect(() => {
    async function loadTrack() {
      const res = await fetch('http://localhost:3000/api/sub-events/2/track')
      const data = await res.json()
      
      setTrack(data)
    }

    loadTrack()

  }, [])

  return (
    <div className="h-full">
      {/* <div className="flex justify-between p-4">
        <Select onValueChange={e => fetchSubEventRunners(e)}>
          <SelectTrigger className="w-[360px]">
            <SelectValue placeholder="Selectionner un évènement" />
          </SelectTrigger>
          <SelectContent>
            {
              subEvents.map(se => <SelectItem value={String(se.id)}>{se.name}</SelectItem>)
            }
          </SelectContent>
        </Select>
          <span>{subEventRunners.length} runner</span>
      </div> */}
      <div className="relative h-full">
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
        <LeafletMap track={track} lastUpdatedRunner={lastUpdatedRunner} mapStyle={mapStyle.tileLayer} />
      </div>
    </div>
  )
}