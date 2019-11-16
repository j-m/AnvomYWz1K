'use strict'

const bcrypt = require('bcrypt-promise')

const connection = require('../../database/connection')
const ErrorEnum = require('../../util/ErrorEnum')
const handleError = require('./util/handleError')

async function checkPassword(username, password) {
  const records = await connection.all('select.memberByUsername', username)
  if (records.length === 0) {
    throw new Error(ErrorEnum.USERNAME_UNKNOWN)
  }
  const valid = await bcrypt.compare(password, records[0].password)
  if (valid === false) {
    throw new Error(ErrorEnum.PASSWORD_INCORRECT)
  }
  return records
}

async function login(context) {
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
    const records = await checkPassword(username, password)
    context.session.authorised = true
    context.session.username = records[0].username
    context.session.privileges = records[0].privileges
    context.body = { success: true }
  } catch (error) {
    handleError(context, error)
  }
}

module.exports = login
