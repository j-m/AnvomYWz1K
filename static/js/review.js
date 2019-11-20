/* eslint-disable max-lines-per-function */
'use strict'

async function writeShortReview(game, event) {
  event.preventDefault()

  const formData = new FormData(document.querySelector('#writeShortReview'))
  const object = {game: game, type: 'short'}
  formData.forEach((value, key) => object[key] = value)

  const result = await fetch('/review', {
    method: 'POST',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(object)
  }).then(res => res.json()).catch(err => console.log(err))

  document.querySelector('#writeShortReview').querySelectorAll('.show').forEach(item => {
    item.classList.remove('show')
  })

  if (result.success === false) {
    console.log(result)
    if (result.code !== undefined) {
      document.querySelector('#writeShortReview').querySelector(`.${result.code}`).classList.add('show')
    }
  } else {
    hide('writeShortReview')
    location.reload()
  }

  return false
}
