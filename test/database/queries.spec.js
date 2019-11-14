const connection = require('../../src/database/connection')
const queries = require('../../src/database/queries')

describe('database', () => {
  beforeAll(async () => {
    jest.resetModules()
    process.env.DATABASE = ':memory:'
    await connection.open()
  })

  afterAll(async () => {
    await connection.close()
  })

  describe('queries', () => {
    describe('.get', () => {
      describe('()', () => {
        test('returns an object instead of one result', async done => {
          const sql = queries.get()
          expect(sql).toBeObject()
          done()
        })
      })
      describe('(...)', () => {
        test('returns a match', async done => {
          const sql = queries.get()
          expect(sql).toBeObject()
          done()
        })

        test('throws if no match', async done => {
          expect(() => queries.get('definitely.not.a.query')).toThrow(Error)
          done()
        })
      })
    })
  })
})
