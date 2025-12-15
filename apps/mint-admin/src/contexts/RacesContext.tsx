import Api from "@/Api"
import Ws from "@/Ws"
import type { ApiRace, MergedRace, Race } from "@/declarations"
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

interface RacesContextType {
  apiRaces: ApiRace[]
  wsRaces: Race[]
  mergeds: MergedRace[]
  refreshRaces: () => Promise<void>
  deleteRace: (raceId: string) => Promise<void>
}

const RacesContext = createContext<RacesContextType | undefined>(undefined)

export const RacesProvider = ({ children }: { children: ReactNode }) => {
  const [apiRaces, setApiRaces] = useState<ApiRace[]>([])
  const [wsRaces, setWsRaces] = useState<Race[]>([])

  useEffect(() => {
    refreshRaces()
  }, [])

  async function refreshRaces() {
    const [apiRaces, wsRaces] = await Promise.all([
      Api.getRaces(),
      Ws.getRaces(),
    ])
    setApiRaces(apiRaces)
    setWsRaces(wsRaces)
  }

  async function deleteRace(raceId: string) {
    await Ws.deleteRace(raceId)
    await refreshRaces()
  }

  const mergeds = useMemo<MergedRace[]>(() => {
    const apiMap = new Map(apiRaces.map(r => [r.id, r]))

    return wsRaces.map(wsRace => ({
      id: wsRace.id,
      startDate: wsRace.startDate,
      endDate: wsRace.endDate,
      _api: apiMap.get(wsRace.id),
      _ws: wsRace,
    }))
  }, [apiRaces, wsRaces])

  return (
    <RacesContext.Provider value={{
      apiRaces,
      wsRaces,
      mergeds,
      refreshRaces,
      deleteRace,
    }}>
      {children}
    </RacesContext.Provider>
  )
}

export const useRaces = () => {
  const context = useContext(RacesContext)
  if (!context) {
    throw new Error("useRaces doit être utilisé dans RacesProvider")
  }
  return context
}
