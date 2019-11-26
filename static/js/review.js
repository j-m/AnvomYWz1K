'use strict'

function getFormData(game, type) {
  const formData = new FormData(document.querySelector(`#write${type}Review`))
  const data = {game, type}
  formData.forEach((value, key) => data[key] = value)
  return data
}

function send(game, type) {
  return fetch('/review', {
    method: 'POST',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(getFormData(game, type))
  }).then(res => res.json()).catch(err => console.log(err))
}

function hideErrors(type) {
  document.querySelector(`#write${type}Review`).querySelectorAll('.show').forEach(item => {
    item.classList.remove('show')
  })
}

function showError(type, code) {
  document.querySelector(`#write${type}Review`).querySelector(`.${code}`).classList.add('show')
}

async function review(game, type, event) {
  event.preventDefault()
  const result = await send(game, type)
  hideErrors(type)

  if (result.success === false) {
    console.log(result)
    if (result.code) {
      showError(type, result.code)
    }
  } else {
    location.reload()
  }

  return false
}

let converter
function preview() {
  event.preventDefault()
  if (!converter) {
    converter = new showdown.Converter()
  }
  const data = document.getElementById('longReviewBody').value
  document.getElementById('previewContent').innerHTML = converter.makeHtml(data)
  show('preview')
}

function longReview(data) {
  event.preventDefault()
  if (!converter) {
    converter = new showdown.Converter()
  }
  document.getElementById('previewContent').innerHTML = converter.makeHtml(data)
  show('preview')
}

async function visibility(game, author, type, value) {
  const result = await fetch('/visibility', {
    method: 'POST',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({game, author, type, visibility: value})
  }).then(res => res.json()).catch(err => console.log(err))

  if (result.success === false) {
    console.log(result)
  } else {
    location.reload()
  }
}
