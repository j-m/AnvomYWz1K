'use strict'

const request = require('supertest')

jest.mock('../../../src/routes/util/Session')
const Session = require('../../../src/routes/util/Session')
Session.mockImplementation(() => ({
	authorised: true,
	username: 'userID',
	privileges: 'administrator',
	administrator: true,
	moderator: true
}))

const app = require('../../../src/app/koa')
const connection = require('../../../src/database/connection')
const ErrorEnum = require('../../../src/util/ErrorEnum')

beforeAll(async() => {
	jest.resetModules()
	process.env.DATABASE = ':memory:'
	await connection.open()
	await connection.run('insert.game', ...[
		'gameID',
		'steamAppId',
		'title',
		'summary', null, null, null, null, null, null, null, null
	])
	await connection.run('insert.member', ...[
		'test@test.test',
		'userID',
		'$2a$12$mRK3BPWwiklKSgj9HozTuuCtKi0icbiHHkX2ruBcmSdhNVuykgNnG'
	])
	await connection.run('insert.review', 'gameID', 'userID', '1', 'review body', 'short')
})

afterAll(async() => {
	await connection.run('delete.memberByUsername', 'userID')
	await connection.close()
})

describe('routes post comment', () => {
	test('returns error message from Comment model', async done => {
		const response = await request(app.callback()).post('/comment').send({ })
		expect(response.status).toEqual(200)
		expect(response.type).toEqual('application/json')
		expect(response.body).toEqual({ success: false, code: ErrorEnum.COMMENT_REVIEW_GAME_MISSING })
		done()
	})

	test('returns success if review posted/updated', async done => {
		const response = await request(app.callback())
			.post('/comment')
			.send({game: 'gameID', author: 'userID', type: 'short', body: 'comment'})
		expect(response.status).toEqual(200)
		expect(response.type).toEqual('application/json')
		expect(response.body).toEqual({ success: true })
		done()
	})
})
