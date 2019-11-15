const authorisation = require('./util/authorisation')
const games = require('../api/games')

/**
 * The landing page visible to visitors.
 *
 * @name Home Page
 * @route {GET} /
 * @authentication None.
 */
async function game (context, next) {
  const parameters = authorisation(context, {})
  parameters.games = await games()
  await context.render('games', parameters)
}

module.exports = game
