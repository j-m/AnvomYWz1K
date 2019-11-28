/* eslint-disable max-lines-per-function */
'use strict'

async function addGame(event) {
	event.preventDefault()

	const formData = new FormData(document.querySelector('#addGame'))
	const data = {}
	formData.forEach((value, key) => data[key] = value)

	const result = await fetch('/game', {
		method: 'POST',
		cache: 'no-cache',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	}).then(res => res.json()).catch(err => console.log(err))

	document.querySelector('#addGame').querySelectorAll('.show').forEach(item => {
		item.classList.remove('show')
	})

	if (result.success === false) {
		console.log(result)
		if (result.code !== undefined) {
			document.querySelector('#addGame').querySelector(`.${result.code}`).classList.add('show')
		}
	} else {
		hide('addGame')
		location.reload()
	}

	return false
}
