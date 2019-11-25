'use strict'

const handleError = require('../util/handleError')
const Review = require('../../models/review')
const Member = require('../../models/member')

async function visibility(context) {
  try {
    const body = context.request.body
    const review = new Review()
    await review.visibility(body, context.request.cookieData.username, context.request.cookieData.privileges)
    const member = new Member()
    await member.promote(body.visibility, body.author)
    context.body = { success: true }
  } catch (error) {
    context.body = handleError(error)
  }
}

module.exports = visibility
