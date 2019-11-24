'use strict'

const connection = require('../../database/connection')

async function games(context) {
  const parameters = JSON.parse(JSON.stringify(context.request.cookieData))
  parameters.games = await connection.all('select.allGames')
  await context.render('games', parameters)
}

module.exports = games
