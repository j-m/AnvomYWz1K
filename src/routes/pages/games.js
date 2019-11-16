'use strict'

const authorisation = require('./util/authorisation')

/**
 * The landing page visible to visitors.
 *
 * @name Home Page
 * @route {GET} /
 * @authentication None.
 */
async function game(context) {
  const parameters = authorisation(context, {})
  await context.render('games', parameters)
}

module.exports = game
