const bcrypt = require('bcrypt-promise')

const connection = require('../../database/connection')
const ErrorEnum = require('../../util/ErrorEnum')

async function checkPassword (username, password) {
  const records = await connection.all('select.memberByUsername', username)
  if (records.length === 0) {
    throw new Error(ErrorEnum.USERNAME_UNKNOWN)
  }
  const valid = await bcrypt.compare(password, records[0].password)
  if (valid === false) {
    throw new Error(ErrorEnum.PASSWORD_INCORRECT)
  }
}

async function login (context, next) {
  try {
    const body = context.request.body
    const username = body.username
    const password = body.password
    if (username === undefined) {
      throw new Error(ErrorEnum.USERNAME_MISSING)
    }
    if (password === undefined) {
      throw new Error(ErrorEnum.PASSWORD_MISSING)
    }
    await checkPassword(username, password)
    context.session.authorised = true
    context.session.username = username
    context.body = { success: true }
  } catch (error) {
    if (ErrorEnum.has(error.message)) {
      context.body = { success: false, code: error.message }
    } else {
      context.body = { success: false, message: error.message }
    }
  }
}

module.exports = login
