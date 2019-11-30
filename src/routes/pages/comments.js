'use strict'

const connection = require('../../database/connection')

async function comments(context) {
	const reviewGameID = context.params.game
	const reviewAuthor = context.params.author
	const reviewType = context.params.type

	const parameters = JSON.parse(JSON.stringify(context.request.cookieData))
	await connection.all('select.review', reviewGameID, reviewAuthor, reviewType)
		.then(data => parameters.review = data[0])
	await connection.all('select.comments', reviewGameID, reviewAuthor, reviewType)
		.then(data => parameters.comments = data)

	await context.render('comments', parameters)
}

module.exports = comments
