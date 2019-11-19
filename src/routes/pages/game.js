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

const emoji = {
  10: '🤯',
  9: '🥰',
  8: '😄',
  7: '😀',
  6: '🙂',
  5: '😐',
  4: '🤔',
  3: '🙁',
  2: '🥱',
  1: '🤢',
  0: '🤮'
}

const PERCENTAGE_MULTIPLIER = 100

async function getCounts(data, parameters) {
  parameters.negativeCount = 0
  parameters.positiveCount = 0
  if (data) {
    if (data[1]) {
      parameters.negativeCount = data[0].count
      parameters.positiveCount = data[1].count
    } else {
      data[0].rating ? parameters.positiveCount = data[0].count : parameters.negativeCount = data[0].count
    }
  }
  parameters.totalCount = parameters.negativeCount + parameters.positiveCount
  parameters.negativePercent = Math.round(parameters.negativeCount * PERCENTAGE_MULTIPLIER / parameters.totalCount)
  parameters.positivePercent = Math.round(parameters.positiveCount * PERCENTAGE_MULTIPLIER / parameters.totalCount)
  parameters.emoji = emoji[Math.round(parameters.positiveCount * Object.keys(emoji).length / parameters.totalCount)]
}

const REVIEWS_PER_PAGE = 10

async function game(context) {
  const parameters = authorisation(context, {})
  const shortReviews = connection.all('select.reviewsByGameAndType', context.params.game, 'short', (context.request.query.s || 0) * REVIEWS_PER_PAGE).then(data => parameters.shortReviews = data)
  const longReviews = connection.all('select.reviewsByGameAndType', context.params.game, 'long', (context.request.query.l || 0) * REVIEWS_PER_PAGE).then(data => parameters.longReviews = data )
  const shortReviewCount = connection.all('select.countShortReviewRating', context.params.game).then(data => getCounts(data, parameters))
  const userShortReviewed = connection.all('select.reviewByGameAndAuthorAndType', context.params.game, parameters.username, 'short').then(data => parameters.userShortReviewed = data[0] )

  parameters.game = await connection.all('select.gameByID', context.params.game)
  parameters.game = parameters.game[0]
  parameters.game = fillDefaults(parameters)

  await Promise.all([shortReviews, longReviews, shortReviewCount, userShortReviewed])

  if (context.request.query.s * REVIEWS_PER_PAGE + REVIEWS_PER_PAGE < parameters.totalCount) {
    parameters.nextShortReviews = context.href.replace(`s=${context.request.query.s}`,`s=${Number(context.request.query.s) + 1}`)
  }

  await context.render('game', parameters)
}

module.exports = game
