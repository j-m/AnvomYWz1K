'use strict'

const connection = require('../database/connection')
const ErrorEnum = require('../util/ErrorEnum')

// eslint-disable-next-line complexity
function hasRequiredProperties(review) {
  if (!review) {
    throw Error(ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING)
  }
  if (!review.game) {
    throw Error(ErrorEnum.REVIEW_GAME_MISSING)
  }
  if (!review.author) {
    throw Error(ErrorEnum.REVIEW_AUTHOR_MISSING)
  }
  if (!review.body) {
    throw Error(ErrorEnum.REVIEW_BODY_MISSING)
  }
  if (!review.type) {
    throw Error(ErrorEnum.REVIEW_TYPE_MISSING)
  }
  if (!review.rating) {
    throw Error(ErrorEnum.REVIEW_RATING_MISSING)
  }
}

function isExpectedProperty(key) {
  const expectedKeys = [
    'game',
    'author',
    'body',
    'type',
    'rating',
    'created'
  ]
  if (expectedKeys.includes(key) === false) {
    throw Error(ErrorEnum.REVIEW_UNEXPECTED_KEY)
  }
}

function onlyHasExpectedProperties(review) {
  const keys = Object.keys(review)
  for (const key of keys) {
    isExpectedProperty(key)
  }
}

class Review {
  get data() {
    return [
      this.game,
      this.author,
      this.rating,
      this.body,
      this.type,
      this.created
    ]
  }

  async create(review) {
    hasRequiredProperties(review)
    onlyHasExpectedProperties(review)
    const results = await connection.all('select.reviewsByGameAndAuthorAndType', ...[
      review.game,
      review.author,
      review.type
    ])
    if (results && results.length !== 0) {
      throw Error(ErrorEnum.REVIEW_ALREADY_WRITTEN)
    }
    Object.assign(this, review)
    await connection.run('insert.review', ...this.data)
    this.loaded = true
  }

  async get(game, author, type) {
    const results = await connection.all('select.reviewsByGameAndAuthorAndType', game, author, type)
    if (results || results.length !== 1) {
      throw Error(ErrorEnum.REVIEW_NOT_FOUND)
    }
    Object.assign(this, results[0])
    this.loaded = true
  }
}

module.exports = Review
