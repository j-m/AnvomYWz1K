'use strict'

const connection = require('../database/connection')
const ErrorEnum = require('../util/ErrorEnum')

function checkParameters(review) {
  if (!review.game) {
    throw Error(ErrorEnum.REVIEW_GAME_MISSING)
  }
  if (!review.type) {
    throw Error(ErrorEnum.REVIEW_TYPE_MISSING)
  }
  if (!review.rating) {
    throw Error(ErrorEnum.REVIEW_RATING_MISSING)
  }
  if (!review.body) {
    throw Error(ErrorEnum.REVIEW_BODY_MISSING)
  }
}

class Review {
  async load(author, data) {
    if (!author || !data) {
      throw Error(ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING)
    }
    this.author = author
    checkParameters(data)
    Object.assign(this, data)
    const results = await connection.all('select.review', this.game, this.author, this.type)
    if (results && results.length !== 0) {
      await connection.run('update.review', this.rating, this.body, this.game, this.author, this.type)
    } else {
      await connection.run('insert.review', this.game, this.author, this.rating, this.body, this.type)
    }
    this.loaded = true
  }
}

module.exports = Review
