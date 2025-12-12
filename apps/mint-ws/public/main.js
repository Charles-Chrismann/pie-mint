const emulateUrlEl = document.querySelector('#emulateUrl')
const runnerCountInput = document.querySelector('#runnerCount')
const emulateButton = document.querySelector('#emulate')
const responseEl = document.querySelector('#response')
const loadingEl = document.querySelector('.loader')
const responseContainer = document.querySelector('.responseContainer')
const refreshRacesStatusBtn = document.querySelector('#status')
const runningDisplayEl = document.querySelector('#runnings-display')
const raceStatusContainer = document.querySelector('.status-container')
const templateRaceStatus = document.querySelector("#template-race-status");
const pathSelect = document.querySelector("#path");
const clearRacesBtn = document.querySelector("#clear")

const ioUrlEls = document.querySelectorAll('.io-url')

let races = []
let runnerCount = 10
let selectedGpx = "nantes_boucle.gpx"
let emulateUrl
runnerCountInput.value = runnerCount

function empty(el) {
	while(el.firstChild) {
		el.firstChild.remove()
	}
}

function updateEmulateUrl() {
	emulateUrl = `${location.origin}/races/emulate?runnerCount=${runnerCount}&gpx=${selectedGpx}`
	emulateUrlEl.textContent = `GET ${emulateUrl}`
}

async function refreshRacesStatus() {
	const res = await fetch('/races')
	const data = await res.json()
	races = data
	empty(raceStatusContainer)
	for(const race of data) {
		const clone = document.importNode(templateRaceStatus.content, true);
		clone.querySelector('.delete').addEventListener('click', async () => {
			await fetch(`/races/${race.id}/prune`)
			refreshRacesStatus()
		})
		clone.querySelector('.id').textContent = race.id
		const now = new Date()
		const start = new Date(race.startDate)
		const end = new Date(race.endDate)
		clone.querySelector('.start').textContent = start.toLocaleString("fr-FR", {
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false, // force format 24h
		})
		clone.querySelector('.end').textContent = end.toLocaleString("fr-FR", {
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false, // force format 24h
		})
		if(now > end) {
			clone.querySelector('.status').textContent = "Finished"
		} else if(now < start) {
			clone.querySelector('.status').textContent = "Not Started"
		} else {
			clone.querySelector('.status').textContent = "Running"
		}
		raceStatusContainer.appendChild(clone)
	}
}

updateEmulateUrl()
refreshRacesStatus()
ioUrlEls.forEach(el => el.textContent = location.origin)
pathSelect.value = selectedGpx

runnerCountInput.addEventListener('input', (e) => {
	runnerCount = e.target.value
	updateEmulateUrl()
})

pathSelect.addEventListener('change', (e) => {
	selectedGpx = e.target.value
	updateEmulateUrl()
})

emulateButton.addEventListener('click', async () => {
	loadingEl.classList.remove('hide')
	emulateButton.classList.add('hide')

	const res = await fetch(emulateUrl)

	loadingEl.classList.add('hide')
	emulateButton.classList.remove('hide')

	if(!res.ok) responseEl.textContent = res.status

	const data = await res.json()
	responseEl.textContent = JSON.stringify(data, null, 2)
	responseContainer.classList.remove('hide')

	refreshRacesStatus()
})

refreshRacesStatusBtn.addEventListener('click', refreshRacesStatus)

clearRacesBtn.addEventListener('click', async () => {
	const promises = []
	for(const race of races) {
		promises.push(fetch(`/races/${race.id}/prune`))
	}
	const ress = await Promise.all(promises)
	refreshRacesStatus()
})