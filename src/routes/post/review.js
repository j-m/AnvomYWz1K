'use strict'

const handleError = require('./util/handleError')
const Review = require('../../models/review')

async function review(context) {
  try {
    const body = context.request.body
    body.author = context.session.username
    await new Review().create(body)
    context.body = { success: true }
  } catch (error) {
    context.body = handleError(error)
  }
}

module.exports = review
