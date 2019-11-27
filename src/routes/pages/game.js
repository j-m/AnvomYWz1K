'use strict'

const connection = require('../../database/connection')
const PERCENTAGE_MULTIPLIER = require('../../util/magicNumbers').PERCENTAGE_MULTIPLIER
const updateQueryParam = require('../util/updateQueryParam')

const EMOJI = {
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

function calculatePercentage(dividend, divisor) {
  if (divisor === 0) {
    return 0
  }
  return Math.round(dividend * PERCENTAGE_MULTIPLIER / divisor)
}

function getCounts(data, parameters) {
  parameters.negativeCount = 0
  parameters.positiveCount = 0
  if (data && data.length !== 0) {
    if (data[1]) {
      parameters.negativeCount = data[0].count
      parameters.positiveCount = data[1].count
    } else {
      data[0].rating === 1 ? parameters.positiveCount = data[0].count : parameters.negativeCount = data[0].count
    }
  }
  parameters.totalCount = parameters.negativeCount + parameters.positiveCount
  parameters.negativePercent = calculatePercentage(parameters.negativeCount, parameters.totalCount)
  parameters.positivePercent = calculatePercentage(parameters.positiveCount, parameters.totalCount)
  const emojiCount = Object.keys(EMOJI).length - 1
  parameters.emoji = EMOJI[Math.round(parameters.positiveCount * emojiCount / parameters.totalCount)]
}

function getHistogram(data) {
  let count = 0
  let sum = 0
  for (const datum of data) {
    count += datum.count
    sum += datum.rating
  }
  const ratings = new Array(PERCENTAGE_MULTIPLIER + 1).fill({count: 0, percent: 100})
  for (const datum of data) {
    ratings[datum.rating] = {
      rating: datum.rating,
      count: datum.count,
      percent: PERCENTAGE_MULTIPLIER - calculatePercentage(datum.count, count)
    }
  }
  return { ratings, count, average: count===0 ? '?' : Math.round(sum/count)}
}

async function reviewsPromise(gameID, type, page) {
  return connection.all('select.reviews', ...[
    gameID,
    type,
    (page || 0) * Number(process.env.REVIEWS_PER_PAGE),
    Number(process.env.REVIEWS_PER_PAGE)
  ])
}

function getReviewPromises(parameters, gameID, query) {
  const shortReviews = reviewsPromise(gameID,'short', query.s)
    .then(data => parameters.shortReviews = data)
  const longReviews = reviewsPromise(gameID,'long', query.l)
    .then(data => parameters.longReviews = data )
  const shortReviewCount = connection.all('select.countReviews', gameID, 'short')
    .then(data => getCounts(data, parameters))
  const longReviewCount = connection.all('select.countReviews', gameID, 'long')
    .then(data => parameters.histogram = getHistogram(data))
  const userShortReviewed = connection.all('select.review', gameID, parameters.username, 'short')
    .then(data => parameters.userShortReviewed = data[0] )
  const userLongReviewed = connection.all('select.review', gameID, parameters.username, 'long')
    .then(data => parameters.userLongReviewed = data[0] )
  return [shortReviews, longReviews, shortReviewCount, longReviewCount, userShortReviewed, userLongReviewed]
}

function checkShortReviewPages(total, href, query) {
  const shortReviewPage = Number(query.s) || 0
  if ((shortReviewPage + 1) * Number(process.env.REVIEWS_PER_PAGE) < total) {
    return updateQueryParam(href, 's', shortReviewPage + 1, shortReviewPage)
  }
}

function checkLongReviewPages(total, href, query) {
  const longReviewPage = Number(query.l) || 0
  if ((longReviewPage + 1) * Number(process.env.REVIEWS_PER_PAGE) < total) {
    return updateQueryParam(href, 'l', longReviewPage + 1, longReviewPage)
  }
}

async function game(context) {
  const gameID = context.params.game
  const parameters = JSON.parse(JSON.stringify(context.request.cookieData))
  const reviewPromises = getReviewPromises(parameters, gameID, context.request.query)

  parameters.game = await connection.all('select.gameByID', gameID)
  parameters.game = parameters.game[0]
  parameters.game = fillDefaults(parameters)

  await Promise.all(reviewPromises)

  parameters.nextShortReviews = checkShortReviewPages(parameters.totalCount, context.href, context.request.query)
  parameters.nextLongReviews = checkLongReviewPages(parameters.histogram.count, context.href, context.request.query)

  parameters.CI = process.env.CI

  await context.render('game', parameters)
}

module.exports = game
