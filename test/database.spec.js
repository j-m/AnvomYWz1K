const database = require('../src/database.js')

let originalDatabaseName = process.env.DATABASE

describe('database', () => {
  describe('.close()', () => {
    test('does not throw if close before opening', async done => {
      await database.close()
      done()
    })
  })
})

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
    test('creates a table', async done => {
      await expect(database.getTableRows()).rejects.toThrow()
      await database.createTable()
      expect(await database.getTableRows()).toEqual([])
      done()
    })
  })

  describe('.addRowToTable()', () => {
    test('adds a row to a table', async done => {
      await database.createTable()
      expect(await database.getTableRows()).toEqual([])
      await database.addRowToTable()
      expect(await database.getTableRows()).toEqual([{ id: 1 }])
      done()
    })
  })
})
