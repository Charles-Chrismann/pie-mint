import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { Link } from "react-router-dom"
import { useRaces } from "@/contexts/RacesContext"
import { useMemo } from "react"

export default function RacesStatus() {

	const { mergeds } = useRaces()

	const races = useMemo(() => [...mergeds].reverse(), [mergeds])

	const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
	
	const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
		hour: "2-digit",
		minute: "2-digit",
	});

	function renderRaceStatus(startStr: string, endStr: string) {
		const start = new Date(startStr)
		const end = new Date(endStr)
		const now = new Date()
	
		let statusClass: string
		let statusText: string
	
		if (now >= start && now < end) {
			statusClass = "bg-green-500 text-white"
			statusText = "En cours"
		} else if (now < start) {
			statusClass = "bg-yellow-400 text-black"
			statusText = "À venir"
		} else {
			statusClass = "bg-gray-400 text-white"
			statusText = "Terminée"
		}
	
		return (
			<div className="flex gap-2 text-sm">
				<span className="text-muted-foreground">
					{dateFormatter.format(start)} • {timeFormatter.format(start)}
					{" → "}
					{timeFormatter.format(end)}
				</span>
	
				<span className={cn("inline-block rounded px-2 py-1 text-xs font-medium w-fit", statusClass)}>
					{statusText}
				</span>
			</div>
		)
	}
	

	return (
		<ul className="
		grid
		grid-cols-1
		md:grid-cols-2
		lg:grid-cols-3
		gap-4
	">
			{
				races.map(r => (
					<li key={r.id}>
						<Card>
							<CardHeader>
								<CardTitle className="flex justify-between">
									<span></span>
									{renderRaceStatus(r.startDate, r.endDate)}
								</CardTitle>
								<CardDescription>{r.id}</CardDescription>
							</CardHeader>
							<CardContent>
								
							</CardContent>
							<CardFooter className="flex gap-2 justify-end">
									<Button
										className=""
										variant="ghost"
									>Supprimer</Button>
								<Link to={`/races/${r.id}`}>
								<Button
									className=""
								>Regarder</Button>
								</Link>
							</CardFooter>
						</Card>
					</li>
				))
			}
		</ul>
	)
}