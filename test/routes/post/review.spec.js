'use strict'

const request = require('supertest')

jest.mock('../../../src/routes/util/Session')
const Session = require('../../../src/routes/util/Session')
Session.mockImplementation(() => ({
	authorised: true,
	username: 'real',
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
		'id',
		'steamAppId',
		'title',
		'summary', null, null, null, null, null, null, null, null
	])
	await connection.run('insert.member', ...[
		'test@test.test',
		'real',
		'$2a$12$mRK3BPWwiklKSgj9HozTuuCtKi0icbiHHkX2ruBcmSdhNVuykgNnG'
	])
})

afterAll(async() => {
	await connection.run('delete.memberByUsername', 'real')
	await connection.close()
})

describe('routes post review', () => {
	test('returns error message from Review model', async done => {
		const response = await request(app.callback()).post('/review').send({ })
		expect(response.status).toEqual(200)
		expect(response.type).toEqual('application/json')
		expect(response.body).toEqual({ success: false, code: ErrorEnum.REVIEW_GAME_MISSING })
		done()
	})

	test('returns success if review posted/updated', async done => {
		const response = await request(app.callback())
			.post('/review')
			.send({
				game: 'id',
				rating: '1',
				type: 'short',
				body: 'test'
			})
		expect(response.status).toEqual(200)
		expect(response.type).toEqual('application/json')
		expect(response.body).toEqual({ success: true })
		done()
	})
})
