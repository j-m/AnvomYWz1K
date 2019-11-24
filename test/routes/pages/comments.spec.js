'use strict'

const request = require('supertest')

const app = require('../../../src/app/koa')
const connection = require('../../../src/database/connection')
const scrubSnapshot = require('../../../src/test/util/scrubSnapshot')

describe('routes get game', () => {
  beforeAll(async() => {
    jest.resetModules()
    process.env.DATABASE = ':memory:'
    process.env.REVIEWS_PER_PAGE = '2'
    await connection.open()
    await Promise.all([
      connection.run('insert.game', ...[
        'gameID',
        'steamAppId',
        'title',
        'summary', null, null, null, null, null, null, null, null
      ]),
      connection.run('insert.member', 'any', 'userID', 'any'),
    ])
    await connection.run('insert.review', 'gameID', 'userID', '1', 'review body', 'short')
    await connection.run('insert.comment', 'gameID', 'userID', 'short', 'userID', 'comment')
  })

  afterAll(async() => {
    await connection.close()
  })

  test('should contain templated text with generated thumbnail, banner, and store', async() => {
    const response = await request(app.callback()).get('/games/gameID/userID/short')
    expect(scrubSnapshot(response.text)).toMatchSnapshot()
  })

})
