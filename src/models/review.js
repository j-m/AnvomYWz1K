'use strict'

const connection = require('../database/connection')
const ErrorEnum = require('../util/ErrorEnum')

function hasSearchParameters(review) {
  if (!review) {
    throw Error(ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING)
  }
  if (!review.game) {
    throw Error(ErrorEnum.REVIEW_GAME_MISSING)
  }
  if (!review.author) {
    throw Error(ErrorEnum.REVIEW_AUTHOR_MISSING)
  }
  if (!review.type) {
    throw Error(ErrorEnum.REVIEW_TYPE_MISSING)
  }
}

function hasContentParameters(review) {
  if (!review.rating) {
    throw Error(ErrorEnum.REVIEW_RATING_MISSING)
  }
  if (!review.body) {
    throw Error(ErrorEnum.REVIEW_BODY_MISSING)
  }
}

function canSetNewVisibility(newVisibility, user, author) {
  if (user.privileges === 'administrator') {
    return
  }
  if (newVisibility === 'author'
    && (user.username !== author || user.privileges !== 'moderator')) {
    throw Error(ErrorEnum.REVIEW_INSUFFICIENT_PRIVILEGES)
  }
}

class Review {
  async load(author, data) {
    if (!author || !data) {
      throw Error(ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING)
    }
    data.author = author
    hasSearchParameters(data)
    hasContentParameters(data)
    Object.assign(this, data)
    const results = await connection.all('select.review', this.game, this.author, this.type)
    if (results && results.length !== 0) {
      await connection.run('update.review', this.rating, this.body, this.game, this.author, this.type)
    } else {
      await connection.run('insert.review', this.game, this.author, this.rating, this.body, this.type)
    }
    this.loaded = true
  }

  async visibility(data, username, privileges) {
    hasSearchParameters(data)
    if (!data.visibility) {
      throw Error(ErrorEnum.REVIEW_VISIBILITY_MISSING)
    }
    if (privileges === 'none') {
      throw Error(ErrorEnum.REVIEW_INSUFFICIENT_PRIVILEGES)
    }
    const results = await connection.all('select.review', data.game, data.author, data.type)
    if (results && results.length !== 0) {
      canSetNewVisibility(data.visibility, {privileges, username}, data.author)
      await connection.run('update.visibility', data.visibility, data.game, data.author, data.type)
    } else {
      throw Error(ErrorEnum.REVIEW_NOT_FOUND)
    }
    this.loaded = true
  }
}

module.exports = Review
