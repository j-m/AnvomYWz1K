'use strict'

const request = require('supertest')

const app = require('../../../src/app/koa')
const connection = require('../../../src/database/connection')
const ErrorEnum = require('../../../src/util/ErrorEnum')

beforeAll(async() => {
  jest.resetModules()
  process.env.DATABASE = ':memory:'
  await connection.open()
})

afterAll(async() => {
  await connection.close()
})

describe('routes post game', () => {
  test('returns success', async done => {
    const response = await request(app.callback()).post('/game').send({
      title: 'title',
      summary: 'summary',
      thumbnail: 'thumbnail'
    })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toEqual({ success: true })
    done()
  })

  test('returns error from Game model', async done => {
    const response = await request(app.callback()).post('/game').send({ })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toEqual({ success: false, code: ErrorEnum.GAME_TITLE_MISSING })
    done()
  })
})
