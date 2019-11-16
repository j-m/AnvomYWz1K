'use strict'

const authorisation = require('./util/authorisation')
const connection = require('../../database/connection')

async function game(context) {
  const parameters = authorisation(context, {})
  parameters.games = await connection.all('select.allGames')
  await context.render('games', parameters)
}

module.exports = game
