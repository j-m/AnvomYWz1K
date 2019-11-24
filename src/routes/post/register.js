'use strict'

const bcrypt = require('bcrypt-promise')

const connection = require('../../database/connection')
const validateUsername = require('../util/validateUsername')
const ErrorEnum = require('../../util/ErrorEnum')
const handleError = require('../util/handleError')

async function insert(email, username, password) {
  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS))
  password = await bcrypt.hash(password, salt)
  await connection.run('insert.member', email, username, password)
}

function validateEmail(email) {
  if (!email) {
    throw new Error(ErrorEnum.EMAIL_MISSING)
  }
}

function validatePassword(password) {
  if (!password) {
    throw new Error(ErrorEnum.PASSWORD_MISSING)
  }
  if (password.length < process.env.MINIMUM_PASSWORD_LENGTH) {
    throw new Error(ErrorEnum.PASSWORD_TOO_SHORT)
  }
}

async function register(context) {
  try {
    const body = context.request.body
    validateEmail(body.email)
    await validateUsername(body.username)
    validatePassword(body.password)
    await insert(body.email, body.username, body.password)
    context.session.authorised = true
    context.session.username = body.username
    context.body = { success: true }
  } catch (error) {
    context.body = handleError(error)
  }
}

module.exports = register
