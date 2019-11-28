'use strict'

const connection = require('../database/connection')
const ErrorEnum = require('../util/ErrorEnum')

function getReview(data) {
	if (!data.game) {
		throw Error(ErrorEnum.COMMENT_REVIEW_GAME_MISSING)
	}
	if (!data.author) {
		throw Error(ErrorEnum.COMMENT_REVIEW_AUTHOR_MISSING)
	}
	if (!data.type) {
		throw Error(ErrorEnum.COMMENT_REVIEW_TYPE_MISSING)
	}
	return {
		game: data.game,
		author: data.author,
		type: data.type
	}
}


class Comment {
	async create(author, data) {
		if (!data) {
			throw Error(ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING)
		}
		this.author = author
		const review = getReview(data)
		await connection.run('insert.comment',
			review.game,
			review.author,
			review.type,
			author,
			data.body
		)
	}
}

module.exports = Comment
