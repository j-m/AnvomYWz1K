const database = require('../src/database.js')

let originalDatabaseName = process.env.DATABASE

describe('database', () => {
  beforeAll(async () => {
    jest.resetModules()
    originalDatabaseName = process.env.DATABASE
    process.env.DATABASE = ':memory:'
    await database.open()
  })

  afterAll(async () => {
    await database.close()
    process.env.DATABASE = originalDatabaseName
  })

  describe('.createTable()', () => {
    test('should create a table', async done => {
      await expect(database.getTableRows()).rejects.toThrow()
      await database.createTable()
      expect(await database.getTableRows()).toEqual([])
      done()
    })
  })
})
