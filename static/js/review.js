'use strict'

async function review(game, type, event) {
  event.preventDefault()

  const formData = new FormData(document.querySelector(`#write${type}Review`))
  const object = {game, type}
  formData.forEach((value, key) => object[key] = value)

  const result = await fetch('/review', {
    method: 'POST',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(object)
  }).then(res => res.json()).catch(err => console.log(err))

  document.querySelector(`#write${type}Review`).querySelectorAll('.show').forEach(item => {
    item.classList.remove('show')
  })

  if (result.success === false) {
    console.log(result)
    if (result.code !== undefined) {
      document.querySelector(`#write${type}Review`).querySelector(`.${result.code}`).classList.add('show')
    }
  } else {
    location.reload()
  }

  return false
}
