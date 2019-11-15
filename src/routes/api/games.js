const connection = require('../../../src/database/connection')

async function games () {
  const allGames = await connection.all('select.allGames')
  return allGames
}

module.exports = games
