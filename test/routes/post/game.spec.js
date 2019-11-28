'use strict'

const request = require('supertest')

process.env.DATABASE = ':memory:'
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
	await connection.open()
})

afterAll(async() => {
	await connection.close()
})

describe('routes post game', () => {
	test('returns success', async done => {
		const response = await request(app.callback()).post('/game').send({
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
		const response = await request(app.callback()).post('/game').send({ })
		expect(response.status).toEqual(200)
		expect(response.type).toEqual('application/json')
		expect(response.body).toEqual({ success: false, code: ErrorEnum.GAME_STEAM_APP_ID_MISSING })
		done()
	})
})
