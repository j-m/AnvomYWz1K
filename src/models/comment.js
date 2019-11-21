'use strict'

const connection = require('../database/connection')

class Comment {
  async create(review, author, body) {
    await connection.run('insert.comment',
      review.game,
      review.author,
      review.type,
      author,
      body
    )
  }
}

module.exports = Comment
