'use strict'

const connection = require('../../database/connection')

async function games(context) {
  const parameters = JSON.parse(JSON.stringify(context.request.cookieData))
  parameters.categories = {}
  const games = await connection.all('select.allGames')
  games.forEach(game => {
    const category = game.category || 'Other'
    if (!parameters.categories[category]) {
      parameters.categories[category] = []
    }
    parameters.categories[category].push(game)
  })
  await context.render('games', parameters)
}

module.exports = games
