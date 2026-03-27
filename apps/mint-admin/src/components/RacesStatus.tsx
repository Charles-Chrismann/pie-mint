import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Link } from "react-router-dom"
import { useRaces } from "@/contexts/RacesContext"
import { useMemo } from "react"
import config from "@/config"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import RaceCard from "./cards/RaceCard"
import { renderRaceStatus } from "@/lib/utilsTsx"
import { Spinner } from "./ui/spinner"

export default function RacesStatus() {

	const { mergeds, deleteRace, loadingRaces } = useRaces()

	const races = useMemo(() => [...mergeds].reverse(), [mergeds])

	if(loadingRaces) return (
		<div className="flex items-center gap-2">
			<Spinner />
			<span>Loading races...</span>
		</div>
	)

	return (
		<Tabs defaultValue="all">
			<TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="emulated">Emulated</TabsTrigger>
      </TabsList>
			<TabsContent value="all">
			<ul className="
				grid
				grid-cols-1
				xl:grid-cols-2
				gap-4
			">
				{
					races.filter(r => r._api && r._ws).map(r => <RaceCard key={r.id} race={r} />)
				}
			</ul>
			</TabsContent>
			<TabsContent value="emulated">
				<ul className="
				grid
				grid-cols-1
				xl:grid-cols-2
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
									<CardContent className="flex flex-col gap-2">
										<h2 className="underline">Endpoints:</h2>
										<ul>
											<li>Stats: <a
													className="underline"
													href={`${config.WS_URL}/races/${r.id}/stats`}
												>{`${config.WS_URL}/races/${r.id}/stats`}</a>
											</li>
											<li>Ranking: <a
													className="underline"
													href={`${config.WS_URL}/races/${r.id}/ranking`}
												>{`${config.WS_URL}/races/${r.id}/ranking`}</a>
											</li>
										</ul>
									</CardContent>
									<CardFooter className="flex gap-2 justify-end">
											<Button
												className=""
												variant="ghost"
												onClick={() => deleteRace(r.id)}
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
			</TabsContent>
		</Tabs>
	)
}