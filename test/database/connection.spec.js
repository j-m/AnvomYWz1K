'use strict'

const connection = require('../../src/database/connection')
const ErrorEnum = require('../../src/util/ErrorEnum')

describe('database connection', () => {
	describe('.insertAdmin()', () => {
		test('does not insert an admin in development', async done => {
			process.env.NODE_ENV = undefined
			process.env.DATABASE = ':memory:'
			await connection.open()
			const results = await connection.all('select.memberByUsername', 'admin')
			expect(results.length).toBe(0)
			done()
		})

		test('does not insert an admin in development', async done => {
			process.env.NODE_ENV = 'production'
			process.env.DATABASE = ':memory:'
			await connection.open()
			const results = await connection.all('select.memberByUsername', 'admin')
			expect(results.length).toBe(1)
			done()
		})
	})

	describe('.close()', () => {
		test('does not throw if close before opening', async done => {
			process.env.DATABASE = ':memory:'
			await connection.open()
			await connection.close()
			await connection.close()
			done()
		})

		test('does not throw if database never opened', async done => {
			jest.resetModules()
			await connection.close()
			done()
		})

		test('closes database if open', async done => {
			process.env.DATABASE = ':memory:'
			await connection.open()
			await connection.close()
			done()
		})
	})

	describe('.run()', () => {
		test('throws if number of arguments mismatches expected', async done => {
			process.env.DATABASE = ':memory:'
			await connection.open()
			await expect(connection.run('insert.member', '')).rejects.toThrow(ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING)
			done()
		})
	})

	describe('.all()', () => {
		test('throws if number of arguments mismatches expected', async done => {
			process.env.DATABASE = ':memory:'
			await connection.open()
			await expect(connection.all('select.reviews', '')).rejects.toThrow(ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING)
			done()
		})
	})
})
