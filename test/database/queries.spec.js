'use strict'

const connection = require('../../src/database/connection')
const queries = require('../../src/database/queries')

beforeAll(async() => {
	jest.resetModules()
	process.env.DATABASE = ':memory:'
	await connection.open()
})

afterAll(async() => {
	await connection.close()
})


describe('database queries', () => {
	describe('.get', () => {
		test('returns an object instead of one result', async done => {
			const sql = queries.get()
			expect(typeof sql).toBe('object')
			done()
		})

		test('returns a match', async done => {
			const sql = queries.get()
			expect(typeof sql).toBe('object')
			done()
		})

		test('throws if no match', async done => {
			expect(() => queries.get('definitely.not.a.query')).toThrow('Unknown query \'definitely.not.a.query\'')
			done()
		})
	})
})
