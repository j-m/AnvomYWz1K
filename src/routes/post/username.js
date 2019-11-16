'use strict'

const validateUsername = require('./util/validateUsername')
const handleError = require('./util/handleError')

async function username(context) {
  const body = context.request.body
  const username = body.username
  try {
    await validateUsername(username)
    context.body = { success: true }
  } catch (error) {
    handleError(context, error)
  }
}

module.exports = username
