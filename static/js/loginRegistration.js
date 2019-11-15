async function checkUsernameAvailability () {
  const username = document.getElementById('new-username').value
  const result = await fetch('/username', {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username })
  }).then(res => res.json())

  const shown = document.querySelector('#register .show')
  if (shown !== null) {
    shown.forEach(item => {
      item.classList.remove('show')
    })
  }

  if (result.success === false) {
    console.log(result)
    if (result.code !== undefined) {
      document.querySelector('#register .' + result.code).classList.add('show')
    }
  } else {
    document.querySelector('#register .USERNAME_AVAILABLE').classList.add('show')
  }
}

async function login (event) {
  event.preventDefault()

  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  const result = await fetch('/login', {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  }).then(res => res.json())

  const shown = document.querySelector('#login .show')
  if (shown !== null) {
    shown.forEach(item => {
      item.classList.remove('show')
    })
  }

  if (result.success === false) {
    console.log(result)
    if (result.code !== undefined) {
      document.querySelector('#login .' + result.code).classList.add('show')
    }
  } else {
    hide('login')
    location.reload()
  }

  return false
}

async function register (event) {
  event.preventDefault()

  const email = document.getElementById('email').value
  const username = document.getElementById('new-username').value
  const password = document.getElementById('new-password').value
  const result = await fetch('/register', {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, username, password })
  }).then(res => res.json())

  const shown = document.querySelector('#register .show')
  if (shown !== null) {
    shown.forEach(item => {
      item.classList.remove('show')
    })
  }

  if (result.success === false) {
    console.log(result)
    if (result.code !== undefined) {
      document.querySelector('#register .' + result.code).classList.add('show')
    }
  } else {
    hide('register')
    location.reload()
  }

  return false
}

async function logout (event) {
  const result = await fetch('/logout', {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ })
  }).then(res => res.json())

  if (result.success === false) {
    console.log(result)
  } else {
    location.reload()
  }
}
