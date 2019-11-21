'use strict'

function parse(data) {
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

function hideErrors() {
  document.querySelector('#commentForm .show').forEach(item => {
    item.classList.remove('show')
  })
}

function showError(code) {
  document.querySelector(`#commentForm .${code}`).classList.add('show')
}

async function somethingDifferent(event, game, author, type) {
  event.preventDefault()
  const result = await send(game, author, type)
  hideErrors()

  if (result.success === false) {
    console.log(result)
    if (result.code) {
      showError(result.code)
    }
  } else {
    location.reload()
  }

  return false
}
