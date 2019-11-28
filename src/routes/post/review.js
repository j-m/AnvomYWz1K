'use strict'

const handleError = require('../util/handleError')
const Review = require('../../models/review')

async function review(context) {
	try {
		const body = context.request.body
		const review = new Review()
		await review.load(context.request.cookieData.username, body)
		context.body = { success: true }
	} catch (error) {
		context.body = handleError(error)
	}
}

module.exports = review
