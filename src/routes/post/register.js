const bcrypt = require('bcrypt-promise')
const connection = require('../../database/connection.js')

async function insert (email, username, password) {
  const records = await connection.run('select.memberByUsername')
  if (records.length !== 0) {
    throw new Error('USERNAME_IN_USE')
  }
  password = await bcrypt.hash(password, process.env.SALT_ROUNDS)
  await connection.run('insert.member', email, username, password)
}

function validateEmail (email) {
  if (email === undefined) {
    throw new Error('EMAIL_MISSING')
  }
}

function validateUsername (username) {
  if (username === undefined) {
    throw new Error('USERNAME_MISSING')
  }
  if (username.match('/^[a-z0-9]+([a-z0-9-]+[a-z0-9])?$/iD').length !== 1) {
    throw new Error('USERNAME_BAD_REGEX')
  }
}

function validatePassword (password) {
  if (password === undefined) {
    throw new Error('PASSWORD_MISSING')
  }
  if (password.length < process.env.MINIMUM_PASSWORD_LENGTH) {
    throw new Error('PASSWORD_TOO_SHORT')
  }
}

async function register (context, next) {
  context.response.type = 'json'
  try {
    const body = context.request.body
    const email = body.email
    const username = body.username
    const password = body.password
    validateEmail(email)
    validateUsername(username)
    validatePassword(password)
    insert(email, username, password)
    context.session.authorised = true
    context.session.username = username
    return context.body({ success: true })
  } catch (error) {
    return context.body({ success: false, reason: error.message })
  }
}

module.exports = register
