const emulateUrlEl = document.querySelector('#emulateUrl')
const runnerCountInput = document.querySelector('#runnerCount')
const emulateButton = document.querySelector('#emulate')
const responseEl = document.querySelector('#response')
const loadingEl = document.querySelector('.loader')
const responseContainer = document.querySelector('.responseContainer')

let runnerCount = 100
let emulateUrl
runnerCountInput.value = runnerCount

function updateEmulateUrl() {
	emulateUrl = `${location.origin}/races/emulate?runnerCount=${runnerCount}`
	emulateUrlEl.textContent = `GET ${emulateUrl}`
}

updateEmulateUrl()

runnerCountInput.addEventListener('input', (e) => {
	runnerCount = e.target.value
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
})
