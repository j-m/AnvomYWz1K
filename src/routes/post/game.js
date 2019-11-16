'use strict'

const handleError = require('./util/handleError')
const Game = require('../../models/game')

async function game(context) {
  try {
    const body = context.request.body
    await new Game().create(body)
    context.body = { success: true }
  } catch (error) {
    handleError(context, error)
  }
}

module.exports = game
