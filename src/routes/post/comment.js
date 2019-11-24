'use strict'

const handleError = require('../util/handleError')
const Comment = require('../../models/comment')

async function comment(context) {
  try {
    const comment = new Comment()
    await comment.create(context.request.cookieData.username, context.request.body)
    context.body = { success: true }
  } catch (error) {
    context.body = handleError(error)
  }
}

module.exports = comment
