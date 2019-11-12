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

  document.getElementById('NEW_USERNAME_MISSING').classList.remove('show')
  document.getElementById('NEW_USERNAME_IN_USE').classList.remove('show')
  document.getElementById('NEW_USERNAME_BAD_REGEX').classList.remove('show')
  document.getElementById('NEW_USERNAME_AVAILABLE').classList.remove('show')

  if (result.success === false) {
    console.log(result.message)
    document.getElementById(result.message).classList.add('show')
  } else {
    document.getElementById('NEW_USERNAME_AVAILABLE').classList.add('show')
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

  document.getElementById('USERNAME_MISSING').classList.remove('show')
  document.getElementById('USERNAME_UNKNOWN').classList.remove('show')

  document.getElementById('PASSWORD_MISSING').classList.remove('show')
  document.getElementById('PASSWORD_INCORRECT').classList.remove('show')

  if (result.success === false) {
    console.log(result.message)
    document.getElementById(result.message).classList.add('show')
  } else {
    hide('login')
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

  document.getElementById('NEW_EMAIL_MISSING').classList.remove('show')

  document.getElementById('NEW_USERNAME_MISSING').classList.remove('show')
  document.getElementById('NEW_USERNAME_IN_USE').classList.remove('show')
  document.getElementById('NEW_USERNAME_BAD_REGEX').classList.remove('show')
  document.getElementById('NEW_USERNAME_AVAILABLE').classList.remove('show')

  document.getElementById('NEW_PASSWORD_MISSING').classList.remove('show')
  document.getElementById('NEW_PASSWORD_TOO_SHORT').classList.remove('show')

  if (result.success === false) {
    console.log(result.message)
    document.getElementById(result.message).classList.add('show')
  } else {
    hide('register')
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
    console.log(result.message)
  }
}

function hide (popup, event) {
  if (event && event.target !== document.getElementById(popup).parentElement) {
    return
  }
  document.getElementById(popup).parentElement.classList.remove('show')
}

function show (popup) {
  document.getElementById(popup).parentElement.classList.add('show')
  return false
}
