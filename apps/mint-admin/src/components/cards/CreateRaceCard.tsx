import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DatePickerTime } from "../DatePickerTime";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import Api from "@/Api";
import type { LineString, Organization } from "@/declarations";
import { gpxToLineString } from "@/lib/utils";
import TrackPreview from "../TrackPreview";
import { Button } from "../ui/button";
import { useRaces } from "@/contexts/RacesContext";

export default function CreateRaceCard() {
	const { refreshRaces } = useRaces()

	const [name, setName] = useState<string>()
	const [startDate, setStartDate] = useState<Date>()
	const [endDate, setEndDate] = useState<Date>()
	const [organization, setOrganization] = useState<string>()
	// const [runners, setRunners] = useState<string[]>()
	const [gpxFileStr, setGpxFileStr] = useState<string>()
	const [track, setTrack] = useState<LineString>()
	const [organizations, setOrganizations] = useState<Organization[]>([])

	useEffect(() => {
		(async() => setOrganizations(await Api.getOrganizations()))()
	}, [])

	async function createRace() {
		if(
			!name
			|| !startDate
			|| !endDate
			|| !gpxFileStr
			|| !organization
		) throw new Error('Missing fields')
		try {
			await Api.createRace({
				name,
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString(),
				gpxFile: gpxFileStr,
				organization: organization,
				runners: ["6978fd03873f1dcba34af622"]
			})
		} catch (err) {}
		refreshRaces()
	}

	return <Card className="w-xl">
		<CardHeader className="w-fit">
			<CardTitle>Créer une course</CardTitle>
		</CardHeader>
		<CardContent className="flex flex-col gap-8">
			<div className="flex flex-col gap-2">
				<Label htmlFor="name">Nom de la course</Label>
				<Input
					id="name"
					value={name}
					placeholder="Trail des montagnes"
					onInput={e => setName((e.target as HTMLInputElement).value)}
				/>
			</div>
			<div className="flex flex-col gap-2">
				<Label htmlFor="">Début de la course</Label>
				<DatePickerTime date={startDate} setDate={setStartDate} />
			</div>
			<div className="flex flex-col gap-2">
				<Label htmlFor="">Fin de la course</Label>
				<DatePickerTime date={endDate} setDate={setEndDate} />
			</div>
			<Select
				value={organization}
				onValueChange={setOrganization}
			>
				<SelectTrigger id="trackFileName" className="w-full">
					<SelectValue placeholder="Choisir une organization" />
				</SelectTrigger>
				<SelectContent>
					{
						organizations.map(org => <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>)
					}
				</SelectContent>
			</Select>
			<Input
				required
				type="file"
				accept=".gpx"
				onChange={async (e) => {
					const file = e.target.files?.[0] ?? null;
					if(!file) throw new Error('No file')
					const gpxStr = await file.text()
					const line = gpxToLineString(gpxStr)
					setTrack(line as LineString)
					setGpxFileStr(gpxStr);
				}}
				/>
				{
					track && <div className="h-64 aspect-video">
						<TrackPreview track={track} mapStyle={"light"} />
					</div>
				}
		</CardContent>
		<CardFooter>
			<Button
				onClick={createRace}
				className="w-full"
			>Valider</Button>
		</CardFooter>
	</Card>
}