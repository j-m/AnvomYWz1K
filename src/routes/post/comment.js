'use strict'

const handleError = require('./util/handleError')
const Comment = require('../../models/comment')

async function comment(context) {
  try {
    const body = context.request.body.body
    const author = context.session.username
    const review = {
      game: context.request.body.game,
      author: context.request.body.author,
      type: context.request.body.type
    }
    const comment = new Comment()
    await comment.create(review, author, body)
    context.body = { success: true }
  } catch (error) {
    context.body = handleError(error)
  }
}

module.exports = comment
