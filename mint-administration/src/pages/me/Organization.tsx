import Api from "@/Api";
import { DatePicker } from "@/components/DatePicker";
import { DateRangeMultipleMonthPicker } from "@/components/DateRangeMultipleMonthPicker";
import MultipleTracksPreview from "@/components/MultipleTracksPreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Organization, SubEvent, Event, ApiResponseGetOrganizationTracks, TrackPoint } from "@/declarations";
import React from "react";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import { Link, useParams } from "react-router-dom";

export default function OrganizationPage() {
  const { organizationId } = useParams();

  const [organization, setOrganization] = useState<Organization>()
  const [events, setEvents] = useState<Event[]>([])
  const [subEvents, setSubEvents] = useState<Map<number, SubEvent[]>>(new Map())
  const [tracks, setTracks] = useState<ApiResponseGetOrganizationTracks>([])

  // createEventForm
  const [eventName, setEventName] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 5, 15),
    to: new Date(2025, 6, 15),
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set('organization_id', organizationId!)
    console.log(formData)
    await Api.authenticatedForm(`/events/`, "POST", formData)
  }

  useEffect(() => {
    async function fetchOrg() {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/me/organizations/' + organizationId, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token') as string
        }
      })
      const data: Organization = await res.json()
      setOrganization(data)
    }
    async function fetchEvents() {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + `/api/organizations/${organizationId}/events`, {
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
      if (!events.length) return

      const ress = await Promise.all(events.map(e => fetch(import.meta.env.VITE_API_BASE_URL + `/api/events/${e.id}/sub-events/`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token') as string
        }
      })))
      const datas: SubEvent[][] = await Promise.all(ress.map(r => r.json()))
      const subEventMap = new Map<number, SubEvent[]>()
      datas.forEach(d => subEventMap.set(d[0].event_id, d))
      setSubEvents(subEventMap)
    }
    fetchSubEvents()
  }, [events])

  useEffect(() => {
    async function fetchTracks() {
      const newTracks = await Api.getPublic<ApiResponseGetOrganizationTracks>(`/organizations/${organizationId}/tracks`)
      const track_points = newTracks.map(t => t.track_points)
      console.log(track_points)
      setTracks(newTracks)
    }

    fetchTracks()
  }, [])

  return (
    <div>
      <h1>{organization?.name}</h1>
      <div>
        <h2>Events:</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full px-8">
          {
            events.map(e =>
              <li key={e.id}>
                <Link to={`./events/${e.id}`}>
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
      <div>
        <Card className="w-min">
          <CardHeader>
            <CardTitle>Créer un évènement</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="createEventForm"
              onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name*</Label>
                  <Input
                    id="name"
                    name="name"
                    value={eventName}
                    onInput={(e) => setEventName((e.target as HTMLInputElement).value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={eventDescription}
                    onInput={(e) => setEventDescription((e.target as HTMLInputElement).value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Durée</Label>
                  <DateRangeMultipleMonthPicker
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                  />
                  <input
                    value={dateRange?.from?.getTime()}
                    name="start_date"
                    id="startDate"
                    readOnly
                    hidden
                  />
                  <input
                    value={dateRange?.to?.getTime()}
                    name="end_date"
                    id="endDate"
                    readOnly
                    hidden
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              form="createEventForm"
            >
              Créer un évènement
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="w-full aspect-video px-4">
        <MultipleTracksPreview tracks={tracks} />
      </div>
    </div>
  )
}