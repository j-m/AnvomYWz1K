'use strict'

const request = require('supertest')

const app = require('../../../src/app/koa')
const connection = require('../../../src/database/connection')

beforeAll(async() => {
  jest.resetModules()
  process.env.DATABASE = ':memory:'
  await connection.open()
  await connection.run('insert.game', 'id', 'title', 'summary', 'thumbnail')
})

afterAll(async() => {
  await connection.close()
})

describe('routes api games', () => {
  test('should return a list of games', async() => {
    const response = await request(app.callback()).get('/api/games')
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toEqual([{
      id: 'id',
      title: 'title',
      summary: 'summary',
      thumbnail: 'thumbnail',
      publisher: null,
      description: null,
      store: null,
      steamAppID: null,
      tags: null,
      releaseDate: null
    }])
  })
})
