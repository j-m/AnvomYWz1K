'use strict'

const bcrypt = require('bcrypt-promise')

const connection = require('../../database/connection')
const ErrorEnum = require('../../util/ErrorEnum')
const handleError = require('../util/handleError')

async function checkCredentials(username, password) {
  const records = await connection.all('select.memberByUsername', username)
  if (records.length === 0) {
    throw new Error(ErrorEnum.USERNAME_UNKNOWN)
  }
  const valid = await bcrypt.compare(password, records[0].password)
  if (valid === false) {
    throw new Error(ErrorEnum.PASSWORD_INCORRECT)
  }
  return records[0]
}

function getCredentials(body) {
  const username = body.username
  const password = body.password
  if (!username) {
    throw new Error(ErrorEnum.USERNAME_MISSING)
  }
  if (!password) {
    throw new Error(ErrorEnum.PASSWORD_MISSING)
  }
  return {username, password}
}

async function login(context) {
  try {
    const {username, password} = getCredentials(context.request.body)
    const member = await checkCredentials(username, password)
    context.session.authorised = true
    context.session.username = member.username
    context.session.privileges = member.privileges
    context.body = { success: true }
  } catch (error) {
    context.body = handleError(error)
  }
}

module.exports = login
