import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Label } from "./ui/label"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"
import Ws from "@/Ws"
import { Field, FieldDescription } from "./ui/field"
import { Link } from "react-router-dom"
import { useRaces } from "@/contexts/RacesContext"

export default function EmulateCard() {

	const { refreshRaces } = useRaces()

	const availableTracks = [
		{ label: "Le début du marathon de Nantes (probablement ce que vous cherchez)", value: "nantes_start.gpx" },
		{ label: "Le marathon de Nantes (très long)", value: "nantes_marathon.gpx" },
		{ label: "Une boucle (moyen)", value: "nantes_boucle.gpx" },
		{ label: "Un truc très court (pour débuguer le check de fin de course)", value: "s.gpx" },
	]
	const runnerCountChoices = [1, 2, 10, 100]

	const [trackFileName, setTrackFileName] = useState(availableTracks[0].value)
	const [runnerCount, setRunnerCount] = useState("10")
	const [raceLink, setRaceLink] = useState<string>()

	async function emulateRace() {
		const race = await Ws.emulateRace({
			gpx: trackFileName,
			runnerCount
		})
		setRaceLink(`/races/${race.id}`)
		refreshRaces()
		setTimeout(() => refreshRaces(), 10 * 1000)
	}

  return (
		<Card className="w-fit">
			<CardHeader>
				<CardTitle>Émuler une course</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<Label htmlFor="trackFileName">Tracé de la course</Label>
					<Select
						value={trackFileName}
						onValueChange={setTrackFileName}
					>
						<SelectTrigger id="trackFileName">
							<SelectValue placeholder="Choisir un tracé" />
						</SelectTrigger>
						<SelectContent>
							{
								availableTracks.map(at => <SelectItem key={at.value} value={at.value}>{at.label}</SelectItem>)
							}
						</SelectContent>
					</Select>
				</div>
				
				<div className="flex justify-between">
					<Label>Nombre de coureurs</Label>

					<ToggleGroup
						type="single"
						value={runnerCount}
						onValueChange={(v) => v && setRunnerCount(v)}
						className="justify-start"
					>
						{
							runnerCountChoices.map(rcc => <ToggleGroupItem value={String(rcc)}>{rcc}</ToggleGroupItem>)
						}
					</ToggleGroup>
				</div>
					<Field className="flex-col gap-2">
						<Button
							onClick={emulateRace}
							className="w-full"
						>Valider</Button>
						{
							raceLink &&
							<FieldDescription className="text-center">
								The race starts in 10 seconds <Link to={raceLink}>Watch the race</Link>
							</FieldDescription>
						}
					</Field>
			</CardContent>
		</Card>
  )
}