const validateUsername = require('./util/validateUsername.js')

async function username (context, next) {
  const body = context.request.body
  const username = body.username
  try {
    await validateUsername(username)
    context.body = { success: true }
  } catch (error) {
    context.body = { success: false, message: error.message }
  }
}

module.exports = username
