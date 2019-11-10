const connection = require('../../../src/database/connection.js')
const members = require('../../../src/database/table/members.js')

let originalDatabaseName = process.env.DATABASE

describe('database table members', () => {
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

  describe('.insertMember()', () => {
    test('inserts a row into the members table', async done => {
      expect(await members.selectAll()).toEqual([])
      await members.insertMember('a@b.com', 'username', 'password')
      expect(await members.selectAll()).toEqual([{ 
        email: 'a@b.com',
        username: 'username',
        password: 'password'
      }])
      done()
    })
  })
})
