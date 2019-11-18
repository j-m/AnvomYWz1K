'use strict'

const request = require('supertest')

const app = require('../../../src/app/koa')
const connection = require('../../../src/database/connection')

beforeAll(async() => {
  jest.resetModules()
  process.env.DATABASE = ':memory:'
  await connection.open()
  await connection.run('insert.game', ...[
    'id',
    'steamAppId',
    'title',
    'summary'
  ])
  await connection.run('insert.game', ...[
    'idUnique',
    'steamAppIDUnique',
    'titleUnique',
    'summary',
    'developer',
    'publisher',
    'description',
    'tags',
    'releaseDate',
    'store',
    'thumbnail',
    'banner'
  ])
})

afterAll(async() => {
  await connection.close()
})

describe('routes get game', () => {
  test('should contain templated text with generated thumbnail, banner, and store', async() => {
    const response = await request(app.callback()).get('/games/id')
    expect(response.text).toMatchSnapshot()
  })
  test('should contain templated text with defined thumbnail, banner, and store', async() => {
    const response = await request(app.callback()).get('/games/idUnique')
    expect(response.text).toMatchSnapshot()
  })
})
