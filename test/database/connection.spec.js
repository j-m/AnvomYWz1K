'use strict'

const connection = require('../../src/database/connection')
const ErrorEnum = require('../../src/util/ErrorEnum')

describe('database connection', () => {
  describe('.close()', () => {
    test('does not throw if close before opening', async done => {
      await connection.close()
      done()
    })
  })

  describe('.run()', () => {
    test('throws if number of arguments mismatches expected', async done => {
      jest.resetModules()
      process.env.DATABASE = ':memory:'
      await connection.open()
      await expect(connection.run('insert.member', '')).rejects.toThrow(ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING)
      done()
    })
  })

  describe('.all()', () => {
    test('throws if number of arguments mismatches expected', async done => {
      jest.resetModules()
      process.env.DATABASE = ':memory:'
      await connection.open()
      await expect(connection.all('select.reviews', '')).rejects.toThrow(ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING)
      done()
    })
  })
})
