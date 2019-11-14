const validateUsername = require('./util/validateUsername')
const ErrorEnum = require('../../util/ErrorEnum')

async function username (context, next) {
  const body = context.request.body
  const username = body.username
  try {
    await validateUsername(username)
    context.body = { success: true }
  } catch (error) {
    if (ErrorEnum.has(error.message)) {
      context.body = { success: false, code: error.message }
    } else {
      context.body = { success: false, message: error.message }
    }
  }
}

module.exports = username
