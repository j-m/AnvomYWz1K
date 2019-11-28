'use strict'

const request = require('supertest')

jest.mock('../../../src/routes/util/Session')
const Session = require('../../../src/routes/util/Session')

const app = require('../../../src/app/koa')
const connection = require('../../../src/database/connection')
const ErrorEnum = require('../../../src/util/ErrorEnum')

beforeAll(async done => {
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
	await connection.run('insert.review', 'gameID', 'userID', '1', 'review body', 'long')
	done()
})

afterAll(async done => {
	await connection.close()
	done()
})

describe('routes post visibility', () => {
	test('returns error message from Review Model', async done => {
		Session.mockImplementation(() => ({
			authorised: true,
			username: 'userID',
			privileges: 'administrator',
			administrator: true,
			moderator: true
		}))
		const response = await request(app.callback()).post('/visibility').send({ username: 'real' })
		expect(response.status).toEqual(200)
		expect(response.type).toEqual('application/json')
		expect(response.body).toEqual({ success: false, code: ErrorEnum.REVIEW_GAME_MISSING })
		done()
	})

	test('returns error if privileges lower than current visibility', async done => {
		Session.mockImplementation(() => ({
			authorised: true,
			username: 'userID',
			privileges: 'none',
			administrator: false,
			moderator: false
		}))
		const response = await request(app.callback())
			.post('/visibility')
			.send({ game: 'gameID', author: 'userID', type: 'long', visibility: 'administrator' })
		expect(response.status).toEqual(200)
		expect(response.type).toEqual('application/json')
		expect(response.body).toEqual({ success: false, code: ErrorEnum.REVIEW_INSUFFICIENT_PRIVILEGES })
		done()
	})

	test('returns error if user not author', async done => {
		Session.mockImplementation(() => ({
			authorised: true,
			username: 'different',
			privileges: 'moderator',
			administrator: false,
			moderator: true
		}))
		const response = await request(app.callback())
			.post('/visibility')
			.send({ game: 'gameID', author: 'userID', type: 'long', visibility: 'author' })
		expect(response.status).toEqual(200)
		expect(response.type).toEqual('application/json')
		expect(response.body).toEqual({ success: false, code: ErrorEnum.REVIEW_INSUFFICIENT_PRIVILEGES })
		done()
	})

	test('returns error privileges insufficient', async done => {
		Session.mockImplementation(() => ({
			authorised: true,
			username: 'userID',
			privileges: 'none',
			administrator: false,
			moderator: false
		}))
		const response = await request(app.callback())
			.post('/visibility')
			.send({ game: 'gameID', author: 'userID', type: 'long', visibility: 'public' })
		expect(response.status).toEqual(200)
		expect(response.type).toEqual('application/json')
		expect(response.body).toEqual({ success: false, code: ErrorEnum.REVIEW_INSUFFICIENT_PRIVILEGES })
		done()
	})

	test('returns sucess', async done => {
		Session.mockImplementation(() => ({
			authorised: true,
			username: 'userID',
			privileges: 'administrator',
			administrator: true,
			moderator: true
		}))
		const response = await request(app.callback())
			.post('/visibility')
			.send({ game: 'gameID', author: 'userID', type: 'long', visibility: 'public' })
		expect(response.status).toEqual(200)
		expect(response.type).toEqual('application/json')
		expect(response.body).toEqual({ success: true })
		done()
	})
})
