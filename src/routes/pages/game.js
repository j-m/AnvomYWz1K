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

function getEmoji(score) {
  switch (score) {
    case 10: return '🤯'
    case 9: return '🥰'
    case 8: return '😄'
    case 7: return '😀'
    case 6: return '🙂'
    case 5: return '😐'
    case 4: return '🤔'
    case 3: return '🙁'
    case 2: return '🥱'
    case 1: return '🤢'
    case 0: return '🤮'
  }
}

async function getCounts(data, parameters) {
  parameters.negativeCount = data[0].count
  parameters.positiveCount = data[1].count
  const totalCount = data[0].count + data[1].count
  parameters.negativePercent = Math.round(data[0].count * 100 / totalCount)
  parameters.positivePercent = Math.round(data[1].count * 100 / totalCount)
  parameters.emoji = getEmoji(Math.round(data[1].count * 10 / totalCount))
}

async function game(context) {
  const parameters = authorisation(context, {})
  const shortReviews = connection.all('select.reviewsByGameAndType', context.params.game, 'short', 0).then(data => parameters.shortReviews = data)
  const longReviews = connection.all('select.reviewsByGameAndType', context.params.game, 'long', 0).then(data => parameters.longReviews = data )
  const shortReviewCount = connection.all('select.countShortReviewRating', context.params.game).then(data => getCounts(data, parameters))
  const userShortReviewed = connection.all('select.reviewByGameAndAuthorAndType', context.params.game, parameters.username, 'short').then(data => parameters.userShortReviewed = data[0] )

  parameters.game = await connection.all('select.gameByID', context.params.game)
  parameters.game = parameters.game[0]
  parameters.game = fillDefaults(parameters)

  await Promise.all([shortReviews, longReviews, shortReviewCount, userShortReviewed])
  await context.render('game', parameters)
}

module.exports = game
