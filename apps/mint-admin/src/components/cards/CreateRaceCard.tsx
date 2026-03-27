import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DatePickerTime } from "../DatePickerTime";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import Api from "@/Api";
import type { LineString, Organization } from "@/declarations";
import { cn, gpxToLineString } from "@/lib/utils";
import TrackPreview from "../TrackPreview";
import { Button } from "../ui/button";
import { useRaces } from "@/contexts/RacesContext";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Minus } from "lucide-react";
import { Separator } from "../ui/separator";

export default function CreateRaceCard() {
	const { refreshRaces } = useRaces()

	const [name, setName] = useState<string>()
	const [startDate, setStartDate] = useState<Date>()
	const [endDate, setEndDate] = useState<Date>()
	const [organization, setOrganization] = useState<string>()
	const [runnersHeaders, setRunnersHeaders] = useState<string[] | null>(null)
	const [runners, setRunners] = useState<string[][] | null>()
	const [gpxFileStr, setGpxFileStr] = useState<string | null>(null)
	const [track, setTrack] = useState<LineString | null>(null)
	const [organizations, setOrganizations] = useState<Organization[]>([])
	const [appUserIdColumn, setAppUserIdColumn] = useState<string | null>(null)

	useEffect(() => {
		(async() => setOrganizations(await Api.getOrganizations()))()
	}, [])

	function isFormValid() {
		return !!name
		&& !!startDate
		&& !!endDate
		&& !!organization
		&& !!runners
		&& !!gpxFileStr
		&& !!appUserIdColumn
	}

	async function createRace() {
		if(
			!name
			|| !startDate
			|| !endDate
			|| !gpxFileStr
			|| !organization
			|| !appUserIdColumn
		) throw new Error('Missing fields')
		try {

			const appUserIdColumnIndex = runnersHeaders!.findIndex(rh => rh === appUserIdColumn)
			const runnerIds = runners!.map(r => r[appUserIdColumnIndex])

			await Api.createRace({
				name,
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString(),
				gpxFile: gpxFileStr,
				organization: organization,
				runners: runnerIds
			})
		} catch (err) {}
		refreshRaces()
	}

	return <Card className="w-fit">
		<CardHeader>
			<CardTitle>Créer une course</CardTitle>
		</CardHeader>
		<CardContent className="flex flex-col gap-8">
			<div className="flex justify-between h-56 gap-16">
				<div className="flex flex-col gap-4 w-96">
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
						<Label htmlFor="organization">Organisation</Label>
						<Select
							value={organization}
							onValueChange={setOrganization}
						>
							<SelectTrigger id="organization" className="w-full">
								<SelectValue placeholder="Choisir une organization" />
							</SelectTrigger>
							<SelectContent>
								{
									organizations.map(org => <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>)
								}
							</SelectContent>
						</Select>
					</div>
				</div>
				<Separator orientation="vertical" />
				<div className="flex flex-col gap-4 w-96">
					<div className="flex flex-col gap-2">
						<Label htmlFor="">Début de la course</Label>
						<DatePickerTime date={startDate} setDate={setStartDate} />
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="">Fin de la course</Label>
						<DatePickerTime date={endDate} setDate={setEndDate} />
					</div>
				</div>
			</div>

			<Separator />

			<div className="flex gap-8 justify-between">
				<div className="flex flex-col gap-2 w-96">
					<div className="flex justify-between">
						<Label htmlFor="gpx">Sélection du tracé de la course</Label>
						{
							gpxFileStr && <Button
							onClick={() => {setGpxFileStr(null); setTrack(null)}}
							>
								<Minus />
							</Button>
						}
					</div>
					{
						!gpxFileStr &&
						<Input
							id="gpx"
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
					}
						{
							track && <div className="h-64 aspect-video">
								<TrackPreview track={track} mapStyle={"light"} />
							</div>
						}
				</div>
				<div className="flex flex-col gap-2 w-96">
					<div className="flex justify-between">
						<Label htmlFor="csv">Sélection des courreurs</Label>
						{
							runners && <Button
							onClick={() => {setRunnersHeaders(null); setRunners(null); setAppUserIdColumn(null)}}
							>
								<Minus />
							</Button>
						}
					</div>
					{
						!runners &&
						<Input
							id="csv"
							required
							type="file"
							accept=".csv"
							onChange={async e => {
								const file = e.target.files?.[0] ?? null;
								if(!file) throw new Error('No file')
								const content = await file.text()
								console.log(content)
								const [rawHeaders, ...rawRows] = content.split('\n')
								const separateur = rawHeaders.includes(',') ? "," : ";"
								const headers = rawHeaders.split(separateur)
								const rows = rawRows.map(rr => rr.split(separateur))
								setRunnersHeaders(headers)
								setRunners(rows)
							}}
						/>
					}
					{
						runnersHeaders && runners && <div>
							{
								!runners.length ? <p>No runner found in file</p>
								: <div className="flex flex-col gap-1">
										<div className="flex flex-col gap-2">
											<Label htmlFor="app-userid-column">Colonne correspondant à l'identifiant utilisateur de l'application</Label>
											<Select
												value={appUserIdColumn!}
												onValueChange={setAppUserIdColumn}
											>
												<SelectTrigger id="app-userid-column" className="w-full">
													<SelectValue placeholder="Choisir une colonne" />
												</SelectTrigger>
												<SelectContent>
												{
													runnersHeaders.map(rh => <SelectItem key={rh} value={rh}>{rh}</SelectItem>)
												}
											</SelectContent>
											</Select>
										</div>
										
										<Table>
											<TableCaption>Liste des courreurs à enregistrer</TableCaption>
											<TableHeader>
												<TableRow>
													{
														runnersHeaders.map(rh => <TableHead>{rh}</TableHead>)
													}
												</TableRow>
											</TableHeader>
											<TableBody>
												{
													runners.map(r => (
														<TableRow key={r.join(',')}>
															{
																r.map(i => <TableCell>{i}</TableCell>)
															}
														</TableRow>
													))
												}
											</TableBody>
										</Table>
									</div>
							}
						</div>
					}
				</div>
			</div>
		</CardContent>
		<CardFooter>
			<Button
				disabled={!isFormValid()}
				onClick={createRace}
				className={cn("w-full", !isFormValid() ? "cursor-not-allowed" : null)}
			>Valider</Button>
		</CardFooter>
	</Card>
}