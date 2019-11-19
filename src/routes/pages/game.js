'use strict'

const authorisation = require('./util/authorisation')
const connection = require('../../database/connection')

async function game(context) {
  const parameters = authorisation(context, {})
  parameters.shortReviews = connection.all('select.reviewsByGameShort', context.params.game, 0)
  parameters.longReviews = connection.all('select.reviewsByGameLong', context.params.game, 0)

  parameters.game = await connection.all('select.gameByID', context.params.game)
  parameters.game = parameters.game[0]
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
  await Promise.all([parameters.shortReviews, parameters.longReviews])
  await context.render('game', parameters)
}

module.exports = game
