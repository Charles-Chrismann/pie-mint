import { cn } from "./utils";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
});

export function renderRaceStatus(startStr: string, endStr: string) {
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