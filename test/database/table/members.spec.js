const connection = require('../../../src/database/connection.js')
const members = require('../../../src/database/table/members.js')

let originalDatabaseName = process.env.DATABASE

describe('database/table/members', () => {
  beforeAll(async () => {
    jest.resetModules()
    originalDatabaseName = process.env.DATABASE
    process.env.DATABASE = ':memory:'
    await connection.open()
  })

  afterAll(async () => {
    await connection.close()
    process.env.DATABASE = originalDatabaseName
  })

  describe('.createTable()', () => {
    test('creates a table called members', async done => {
      expect(await members.selectAll()).rejects.toThrow()
      await members.createTable()
      expect(await members.selectAll()).toEqual([])
      done()
    })
  })

  describe('.insertMember()', () => {
    test('inserts a row into the members table', async done => {
      await members.createTable()
      expect(await members.selectAll()).toEqual([])
      await members.insertMember()
      expect(await members.selectAll()).toEqual([{ id: 1 }])
      done()
    })
  })
})
