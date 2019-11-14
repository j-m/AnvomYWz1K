const bcrypt = require('bcrypt-promise')

const connection = require('../../database/connection')
const validateUsername = require('./util/validateUsername')
const ErrorEnum = require('../../util/ErrorEnum')

async function insert (email, username, password) {
  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS))
  password = await bcrypt.hash(password, salt)
  await connection.run('insert.member', email, username, password)
}

function validateEmail (email) {
  if (email === undefined) {
    throw new Error(ErrorEnum.EMAIL_MISSING)
  }
}

function validatePassword (password) {
  if (password === undefined) {
    throw new Error(ErrorEnum.PASSWORD_MISSING)
  }
  if (password.length < process.env.MINIMUM_PASSWORD_LENGTH) {
    throw new Error(ErrorEnum.PASSWORD_TOO_SHORT)
  }
}

async function register (context, next) {
  try {
    const body = context.request.body
    const email = body.email
    const username = body.username
    const password = body.password
    validateEmail(email)
    await validateUsername(username)
    validatePassword(password)
    await insert(email, username, password)
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

module.exports = register
