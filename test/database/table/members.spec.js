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

  describe('.insertMember', () => {
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

  describe('.selectAll()', () => {
    describe('()', () => {
      test('throws if params missing', async done => {
        expect(members.insertMember()).rejects.toThrow()
        done()
      })
    })
  })

  describe('.selectMember', () => {
    test('finds a member by username', async done => {
      await members.insertMember('a@b.com', 'selectMember', 'password')
      expect(await members.selectMember('selectMember')).toEqual([{
        email: 'a@b.com',
        username: 'selectMember',
        password: 'password'
      }])
      done()
    })
  })
})
