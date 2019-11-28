/* eslint-disable max-lines-per-function */
'use strict'

async function updateGame(event) {
	event.preventDefault()

	const formData = new FormData(document.querySelector('#updateGame'))
	const object = {}
	formData.forEach((value, key) => object[key] = value)

	const result = await fetch('/editGame', {
		method: 'POST',
		cache: 'no-cache',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(object)
	}).then(res => res.json()).catch(err => console.log(err))

	document.querySelector('#updateGame').querySelectorAll('.show').forEach(item => {
		item.classList.remove('show')
	})

	if (result.success === false) {
		console.log(result)
		if (result.code !== undefined) {
			document.querySelector('#updateGame').querySelector(`.${result.code}`).classList.add('show')
		}
	} else {
		hide('updateGame')
		location.reload()
	}

	return false
}
