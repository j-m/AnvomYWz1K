'use strict'

const request = require('supertest')

jest.mock('../../../src/routes/util/Session')
const Session = require('../../../src/routes/util/Session')

const app = require('../../../src/app/koa')
const connection = require('../../../src/database/connection')
const ErrorEnum = require('../../../src/util/ErrorEnum')
const authenticate = require('../../../src/routes/middleware/authenticate')

beforeAll(async() => {
  jest.resetModules()
  process.env.DATABASE = ':memory:'
  await connection.open()
  await connection.run('insert.game', ...[
    'id',
    'steamAppId',
    'title',
    'summary', null, null, null, null, null, null, null, null
  ])
})

afterAll(async() => {
  await connection.close()
})

describe('routes middleware authenticate', () => {
  test('isAdmin throws', async done => {
    Session.mockImplementation(() => ({
      authorised: true,
      username: 'username',
      privileges: 'none',
      administrator: false,
      moderator: false
    }))
    await expect(
      authenticate.isAdmin({request: {}, session: {}},() => {})
    ).rejects.toThrow(ErrorEnum.SESSION_INSUFFICIENT_PRIVILEGES)
    done()
  })

  test('isAdmin is successful', async done => {
    Session.mockImplementation(() => ({
      authorised: true,
      username: 'username',
      privileges: 'administrator',
      administrator: true,
      moderator: true
    }))
    expect(
      await authenticate.isAdmin({request: {}, session: {}},() => {})
    ).resolves
    done()
  })

  test('isModerator throws', async done => {
    Session.mockImplementation(() => ({
      authorised: true,
      username: 'username',
      privileges: 'none',
      administrator: false,
      moderator: false
    }))
    await expect(
      authenticate.isModerator({request: {}, session: {}},() => {})
    ).rejects.toThrow(ErrorEnum.SESSION_INSUFFICIENT_PRIVILEGES)
    done()
  })

  test('isModerator is successful', async done => {
    Session.mockImplementation(() => ({
      authorised: true,
      username: 'username',
      privileges: 'administrator',
      administrator: false,
      moderator: true
    }))
    expect(
      await authenticate.isModerator({request: {}, session: {}},() => {})
    ).resolves
    done()
  })
  test('isLoggedIn throws', async done => {
    Session.mockImplementation(() => ({
      authorised: false,
      username: 'username',
      privileges: 'none',
      administrator: false,
      moderator: false
    }))
    await expect(
      authenticate.isLoggedIn({request: {}, session: {}},() => {})
    ).rejects.toThrow(ErrorEnum.SESSION_NOT_LOGGED_IN)
    done()
  })

  test('isLoggedIn is successful', async done => {
    Session.mockImplementation(() => ({
      authorised: true,
      username: 'username',
      privileges: 'administrator',
      administrator: true,
      moderator: true
    }))
    expect(
      await authenticate.isLoggedIn({request: {}, session: {}},() => {})
    ).resolves
    done()
  })

  test('isNotLoggedIn throws', async done => {
    Session.mockImplementation(() => ({
      authorised: true,
      username: 'username',
      privileges: 'none',
      administrator: false,
      moderator: false
    }))
    await expect(
      authenticate.isNotLoggedIn({request: {}, session: {}},() => {})
    ).rejects.toThrow(ErrorEnum.SESSION_LOGGED_IN)
    done()
  })

  test('populateSession is successful', async done => {
    Session.mockImplementation(() => ({
      authorised: true,
      username: 'username',
      privileges: 'administrator',
      administrator: true,
      moderator: true
    }))
    expect(
      authenticate.populateSession({request: {}, session: {}},() => {})
    ).resolves
    done()
  })
})
