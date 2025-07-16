import Api from "@/Api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type {
  FormAddRunner,
  FormUpdateRace,
  StandardDistance,
  Race,
  RaceRegistrationRunners
} from "@/declarations";
import { formUpdator } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function RacePage() {
  const { raceId } = useParams();
  const [race, setRace] = useState<Race>()
  const [raceRunners,setRaceRunners] = useState<RaceRegistrationRunners[]>([])
  const [form, setForm] = useState<FormAddRunner>({
    user_profile_id: undefined,
    bib_alias: undefined,
    bib_number: undefined,
    is_private: undefined,
    race_start_wave_id: undefined
  })

  const [raceUpdateForm, setRaceUpdateForm] = useState<FormUpdateRace>({})
  const [is_standard_distance, setIs_standard_distance] = useState(false)
  const [standardDistances, setStandardDistances] = useState<StandardDistance[]>([])

  const [updateForm] = formUpdator(race!, raceUpdateForm, setRaceUpdateForm)

  useEffect(() => {
    async function fetchRace() {
      setRace(await Api.getPublic<Race>(`/races/${raceId}`))
    }

    fetchRace()
  }, [])

  useEffect(() => {
    if (!race) return
    setIs_standard_distance(!!race.standard_distance_id)
  }, [race])

  useEffect(() => {
    async function fetchRaceRunners() {
      setRaceRunners(await Api.getPublic<RaceRegistrationRunners[]>(`/races/${raceId}/runners`))
    }

    fetchRaceRunners()
  }, [])

  useEffect(() => {
    async function fetchStandardDistances() {
      setStandardDistances(await Api.getPublic<StandardDistance[]>(`/standard-distances`))
    }

    fetchStandardDistances()
  }, [])

  async function addRunner() {
    await Api.authenticatedFetch(`/races/${raceId}/add-runners`, "POST", [
      form
    ])
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData: Record<string, any> = {}
    for (let [key, value] of Object.entries(raceUpdateForm)) {
      formData[key] = value
      if (key === "distance") formData["standard_distance_id"] = null
      if (key === "standard_distance_id") formData["distance"] = null
    }
    console.log(formData)
    const res = await Api.authenticatedFetch(`/races/${raceId}`, 'PATCH', formData)
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
              raceRunners.map(ser => (
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
        race ?
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

            <form
              onSubmit={handleSubmit}
            >
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Input
                      value={raceUpdateForm.name ?? race.name}
                      onInput={(e) => updateForm("name", (e.target as HTMLInputElement).value)}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent
                  className="flex flex-col gap-6"
                >
                  <div
                    className="flex gap-3"
                  >
                    <Checkbox
                      id="is_standard_distance"
                      checked={is_standard_distance}
                      onCheckedChange={(e) => {
                        setIs_standard_distance(e as boolean)

                        const clone = { ...raceUpdateForm }
                        console.log(e, clone)
                        if ((e && raceUpdateForm.distance) || (!e && raceUpdateForm.standard_distance_id)) {
                          delete clone.standard_distance_id
                          delete clone.distance

                          setRaceUpdateForm(clone)
                        }
                      }}
                    />
                    <Label htmlFor="is_standard_distance">Is a standard distance</Label>
                  </div>
                  <div className="flex gap-6">
                    {
                      !is_standard_distance ?
                        <div className="grid gap-3 w-full">
                          <Label htmlFor="distance">Distance</Label>
                          <Input
                            value={raceUpdateForm.distance ?? race.distance ?? ""}
                            id="distance"
                            type="number"
                            step={.001}
                            onInput={(e) => updateForm("distance", (e.target as HTMLInputElement).value)}
                          />
                        </div>
                        :
                        <div className="grid gap-3 w-full">
                          <Label className="opacity-0">.</Label>
                          <Select
                            onValueChange={e => {
                              const clone = { ...raceUpdateForm }
                              clone.standard_distance_id = +e
                              delete clone.distance
                              setRaceUpdateForm(clone)
                            }}
                            value={String(raceUpdateForm.standard_distance_id ?? race.standard_distance_id)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a distance" />
                            </SelectTrigger>
                            <SelectContent>
                              {
                                standardDistances.map(sd =>
                                  <SelectItem
                                    key={sd.id}
                                    value={String(sd.id)}
                                  >
                                    {sd.name}
                                  </SelectItem>
                                )
                              }
                            </SelectContent>
                          </Select>
                        </div>
                    }
                    <div className="grid gap-3 w-full">
                      <Label htmlFor="postive_elevation">Positive Elevation</Label>
                      <Input
                        value={raceUpdateForm.positive_elevation ?? race.positive_elevation ?? ""}
                        id="postive_elevation"
                        type="number"
                        required
                        step={.001}
                        onInput={(e) => updateForm("positive_elevation", (e.target as HTMLInputElement).value)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 w-full">
                    <Label htmlFor="track">Tracé</Label>
                    <Input
                      id="track"
                      type="file"
                      onInput={(e) => setRaceUpdateForm(c => ({ ...c, track_file: (e.target as HTMLInputElement).files![0] }))}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    disabled={!Object.keys(raceUpdateForm).length}
                    type="submit"
                  >Mettre à jour la course</Button>
                </CardFooter>
              </Card>
            </form>
          </div> :
          <div>loading...</div>
      }
    </div>
  )
}