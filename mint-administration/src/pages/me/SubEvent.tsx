import Api from "@/Api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { FormAddRunner, SubEvent, SubEventRegistrationRunners } from "@/declarations";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function SubEventPage() {
  const { subEventId } = useParams();
  const [subEvent, setSubEvent] = useState<SubEvent>()
  const [subEventRunners, setSubEventRunners] = useState<SubEventRegistrationRunners[]>([])
  const [form, setForm] = useState<FormAddRunner>({
    user_profile_id: undefined,
    bib_alias: undefined,
    bib_number: undefined,
    is_private: undefined,
    sub_event_start_wave_id: undefined
  })

  useEffect(() => {
    async function fetchSubEvent() {
      setSubEvent(await Api.getPublic<SubEvent>(`/sub-events/${subEventId}`))
    }

    fetchSubEvent()
  }, [])

  useEffect(() => {
    async function fetchSubEventRunners() {
      setSubEventRunners(await Api.getPublic<SubEventRegistrationRunners[]>(`/sub-events/${subEventId}/runners`))
    }

    fetchSubEventRunners()
  }, [])

  async function addRunner() {
    await Api.authenticatedFetch(`/sub-events/${subEventId}/add-runners`, "POST", [
      form
    ])
  }

  return (
    <div>
      <div>
        <h4>Runners</h4>
        <Table>
          <TableCaption>List of the runners</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Courreur</TableHead>
              <TableHead>Numéro de dossard</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              subEventRunners.map(ser => (
                <TableRow key={ser.registrations.id}>
                  <TableCell>{ser.user_profiles.firstname} {ser.user_profiles.lastname}</TableCell>
                  <TableCell>{ser.registrations.bib_number}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
      {
        subEvent ?
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Ajouter un utilisateur à l'évènement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="user_profile_id">user_profile_id</Label>
                    <Input
                      id="user_profile_id"
                      type="number"
                      required
                      onInput={(e) => setForm({ ...form, user_profile_id: +(e.target as HTMLInputElement).value })}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="bib_number">Numéro de dossard</Label>
                    <Input
                      id="bib_number"
                      type="number"
                      required
                      onInput={(e) => setForm({ ...form, bib_number: +(e.target as HTMLInputElement).value })}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={addRunner}>Valider</Button>
              </CardFooter>
            </Card>
          </div> :
          <div>loading...</div>
      }
    </div>
  )
}