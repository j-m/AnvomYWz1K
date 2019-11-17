'use strict'

const authorisation = require('./util/authorisation')
const connection = require('../../database/connection')

async function game(context) {
  const parameters = authorisation(context, {})
  parameters.game = await connection.all('select.gameByID', context.params.game)
  parameters.game = parameters.game[0]
  await context.render('game', parameters)
}

module.exports = game
