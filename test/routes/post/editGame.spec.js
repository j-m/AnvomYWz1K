'use strict'

const request = require('supertest')

jest.mock('../../../src/routes/util/Session')
const Session = require('../../../src/routes/util/Session')
Session.mockImplementation(() => ({
	authorised: true,
	username: 'username',
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
})

afterAll(async() => {
	await connection.close()
})

describe('routes post game', () => {
	test('returns success', async done => {
		const response = await request(app.callback()).post('/editGame').send({
			steamAppID: 'steam',
			title: 'title',
			summary: 'new summary'
		})
		expect(response.status).toEqual(200)
		expect(response.type).toEqual('application/json')
		expect(response.body).toEqual({ success: true })
		done()
	})

	test('returns error from Game model', async done => {
		const response = await request(app.callback()).post('/editGame').send({ })
		expect(response.status).toEqual(200)
		expect(response.type).toEqual('application/json')
		expect(response.body).toEqual({ success: false, code: ErrorEnum.GAME_UNKNOWN })
		done()
	})
})
