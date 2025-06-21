import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Organization, SubEvent, Event } from "@/declarations";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function OrganizationPage() {
  const [organization, setOrganization] = useState<Organization>()
  const [events, setEvents] = useState<Event[]>([])
  const [subEvents, setSubEvents] = useState<Map<number, SubEvent[]>>(new Map())
  const { id } = useParams();

  useEffect(() => {
    async function fetchOrg() {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/me/organizations/' + id, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token') as string
        }
      })
      const data: Organization = await res.json()
      setOrganization(data)
    }
    async function fetchEvents() {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + `/api/organizations/${id}/events`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token') as string
        }
      })
      const data: Event[] = await res.json()
      setEvents(data)
    }

    fetchOrg()
    fetchEvents()
  }, [])

  useEffect(() => {
    async function fetchSubEvents() {
      if(!events.length) return

      const ress = await Promise.all(events.map(e => fetch(import.meta.env.VITE_API_BASE_URL + `/api/events/${e.id}/sub-events/`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token') as string
        }
      })))
      const datas: SubEvent[][] = await Promise.all(ress.map(r => r.json()))
      const subEventMap = new Map<number, SubEvent[]>()
      datas.forEach(d => subEventMap.set(d[0].event_id, d))
      console.log(datas)
      setSubEvents(subEventMap)
    }
    fetchSubEvents()
  }, [events])

  return (
    <div>
      <h1>{organization?.name}</h1>
      <div>
        <h2>Events:</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full px-8">
          {
            events.map(e =>
              <li key={e.id}>
                <Link to={`#`}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{e.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Du: {e.start_date}</p>
                      <p>Au: {e.end_date}</p>
                      <p>{e.description}</p>
                      <div>
                        <p>Courses durant l'évènement</p>
                        <ul>
                          {
                            subEvents.get(e.id)?.map(se => 
                              <li key={se.id}>
                                {se.name}
                              </li>
                            )
                          }
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            )
          }
        </ul>
      </div>
    </div>
  )
}