const bcrypt = require('bcrypt-promise')
const connection = require('../../database/connection.js')

async function checkPassword (username, password) {
  const records = await connection.run('select.memberByUsername')
  if (records.length === 0) {
    throw new Error(`USERNAME_UNKNOWN`)
  }
  const valid = await bcrypt.compare(password, records[0].password)
  if (valid === false) {
    throw new Error('PASSWORD_INCORRECT')
  }
}

async function login (context, next) {
  context.response.type = 'json'
  try {
    const body = context.request.body
    const username = body.username
    const password = body.password
    if (username === undefined) {
      throw new Error('USERNAME_MISSING')
    }
    if (password === undefined) {
      throw new Error('PASSWORD_MISSING')
    }
    checkPassword(username, password)
    context.session.authorised = true
    context.session.username = username
    return context.body({ success: true })
  } catch (error) {
    return context.body({ success: false, message: error.message })
  }
}

module.exports = login
