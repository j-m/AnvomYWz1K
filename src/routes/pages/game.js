'use strict'

const authorisation = require('./util/authorisation')
const connection = require('../../database/connection')

function fillDefaults(parameters) {
  const id = parameters.game.steamAppID
  if (!parameters.game.banner) {
    parameters.game.banner = `https://steamcdn-a.akamaihd.net/steam/apps/${id}/library_hero.jpg`
  }
  if (!parameters.game.thumbnail) {
    parameters.game.thumbnail = `https://steamcdn-a.akamaihd.net/steam/apps/${id}/library_600x900_2x.jpg`
  }
  if (!parameters.game.store) {
    parameters.game.store = `https://store.steampowered.com/app/${id}`
  }
  return parameters.game
}

async function game(context) {
  const parameters = authorisation(context, {})
  const shortReviews = connection.all('select.reviewsByGameAndType', context.params.game, 'short', 0).then(data => parameters.shortReviews = data)
  const longReviews = connection.all('select.reviewsByGameAndType', context.params.game, 'long', 0).then(data => parameters.longReviews = data )

  parameters.game = await connection.all('select.gameByID', context.params.game)
  parameters.game = parameters.game[0]
  parameters.game = fillDefaults(parameters)

  await Promise.all([shortReviews, longReviews])
  await context.render('game', parameters)
}

module.exports = game
