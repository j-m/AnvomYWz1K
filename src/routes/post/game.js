const ErrorEnum = require('../../util/ErrorEnum')
const Game = require('../../models/game')

async function game (context, next) {
  try {
    const body = context.request.body
    await new Game().create(body)
    context.body = { success: true }
  } catch (error) {
    if (ErrorEnum.has(error.message)) {
      context.body = { success: false, code: error.message }
    } else {
      context.body = { success: false, message: error.message }
    }
  }
}

module.exports = game
