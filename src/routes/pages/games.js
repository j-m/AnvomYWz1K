'use strict'

const connection = require('../../database/connection')

async function games(context) {
  const parameters = context.request.body.parameters
  parameters.games = await connection.all('select.allGames')
  await context.render('games', parameters)
}

module.exports = games
