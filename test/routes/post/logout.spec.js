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

beforeAll(async() => {
	jest.resetModules()
	process.env.DATABASE = ':memory:'
	await connection.open()
})

afterAll(async() => {
	await connection.close()
})

describe('routes post logout', () => {
	test('should clear session', async done => {
		const response = await request(app.callback()).post('/logout').send({ })
		expect(response.status).toEqual(200)
		expect(response.type).toEqual('application/json')
		expect(response.body).toEqual({ success: true })
		done()
	})
})
