'use strict'

const connection = require('../../src/database/connection')
const Member = require('../../src/models/member')

describe('database models member', () => {
  beforeAll(async() => {
    jest.resetModules()
    process.env.DATABASE = ':memory:'
    await connection.open()
  })

  afterAll(async() => {
    await connection.close()
  })

  describe('.create', () => {
    test('throws if username not unique', async done => {
      await connection.run('insert.member', 'a@b.com', 'get', 'password')
      const member = await new Member()
      await expect(member.create('a@b.com', 'get', 'password')).rejects.toThrow()
      connection.run('delete.memberByUsername', 'get')
      done()
    })

    test('inserts a row into the members table', async done => {
      const member = await new Member()
      await member.create('a@b.com', 'create', 'password')
      expect(member.username).toEqual('create')
      connection.run('delete.memberByUsername', 'create')
      done()
    })
  })

  describe('.get', () => {
    test('throws if not found', async done => {
      const member = await new Member()
      await expect(member.get('get')).rejects.toThrow()
      done()
    })

    test('finds a member by username', async done => {
      await connection.run('insert.member', 'a@b.com', 'get', 'password')
      const member = await new Member()
      await member.get('get')
      expect(member.username).toEqual('get')
      connection.run('delete.memberByUsername', 'get')
      done()
    })
  })

  describe('.promote', () => {
    test('requires review type to be long', async done => {
      await connection.run('insert.member', 'a@b.com', 'promote1', 'password')
      const member = await new Member()
      await member.promote('short')
      const results = await connection.all('select.memberByUsername', 'promote1')
      expect(results[0].privileges).toEqual('none')
      done()
    })

    test('requires review visibility to now be public', async done => {
      await connection.run('insert.member', 'a@b.com', 'promote2', 'password')
      const member = await new Member()
      await member.promote('long', 'moderator','promote2')
      const results = await connection.all('select.memberByUsername', 'promote2')
      expect(results[0].privileges).toEqual('none')
      done()
    })

    test('promotes if review is long and visible is now public', async done => {
      await connection.run('insert.member', 'a@b.com', 'promote3', 'password')
      const member = await new Member()
      await member.promote('long', 'public', 'promote3')
      const results = await connection.all('select.memberByUsername', 'promote3')
      expect(results[0].privileges).toEqual('moderator')
      done()
    })
  })
})
