'use strict'

function parseDifferent(data) {
  let converter
  event.preventDefault()
  if (!converter) {
    converter = new showdown.Converter()
  }
  document.getElementById('reviewBody').innerHTML = converter.makeHtml(data)
}

function send(game, author, type) {
  return fetch('/comment', {
    method: 'POST',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({game, author, type, body: document.getElementById('commentInput').value})
  }).then(res => res.json()).catch(err => console.log(err))
}

async function somethingDifferent(event, game, author, type) {
  event.preventDefault()
  const result = await send(game, author, type)
  if (result.success) {
    location.reload()
  }
  return false
}
