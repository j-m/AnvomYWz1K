'use strict'

const handleError = require('../util/handleError')
const Game = require('../../models/game')

async function editGame(context) {
	try {
		const body = context.request.body
		const game = await new Game()
		await game.get(body.title)
		game.update(body)
		context.body = { success: true }
	} catch (error) {
		context.body = handleError(error)
	}
}

module.exports = editGame
