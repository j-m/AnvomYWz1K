'use strict'

const request = require('supertest')

const app = require('../../../src/app/koa')
const connection = require('../../../src/database/connection')

beforeAll(async() => {
	jest.resetModules()
	process.env.DATABASE = ':memory:'
	await connection.open()
	await Promise.all([
		connection.run('insert.game', ...['id','steamAppId', 'title', 'summary', 'developer',
			'publisher', 'description', 'category', 'releaseDate', 'store', 'thumbnail', 'banner'
		]),
		connection.run('insert.game', ...['id2','steamAppId2', 'title2', 'summary', 'developer',
			'publisher', 'description', 'category', 'releaseDate', 'store', 'thumbnail', 'banner'
		]),
		connection.run('insert.game', ...['id3', 413150, 'title3', 'summary', 'developer',
			'publisher', 'description', null, null, null, null, null
		])
	])
})

afterAll(async() => {
	await connection.close()
})

describe('routes get games', () => {
	test('should contain templated text', async() => {
		const response = await request(app.callback()).get('/games/')
		expect(response.status).toEqual(200)
		expect(response.text).toMatchSnapshot()
	})
})
