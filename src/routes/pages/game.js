'use strict'

const authorisation = require('./util/authorisation')

async function game(context) {
  const parameters = authorisation(context, {})
  await context.render('game', parameters)
}

module.exports = game
