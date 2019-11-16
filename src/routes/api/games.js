'use strict'

const connection = require('../../../src/database/connection')

async function games(context) {
  const allGames = await connection.all('select.allGames')
  context.body = allGames
}

module.exports = games
