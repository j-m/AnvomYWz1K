'use strict'

const request = require('supertest')

const app = require('../../../src/app/koa')
const connection = require('../../../src/database/connection')
const ErrorEnum = require('../../../src/util/ErrorEnum')

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
  await connection.run('insert.member', ...[
    'test@test.test',
    'real',
    '$2a$12$mRK3BPWwiklKSgj9HozTuuCtKi0icbiHHkX2ruBcmSdhNVuykgNnG'
  ])
})

afterAll(async() => {
  await connection.run('delete.memberByUsername', 'real')
  await connection.close()
})

describe('routes post username', () => {
  test('returns error message from Review model', async done => {
    const response = await request(app.callback()).post('/review').send({ })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toEqual({ success: false, code: ErrorEnum.REVIEW_GAME_MISSING })
    done()
  })

  test('returns success if review posted/updated', async done => {
    const login = await request(app.callback()).post('/login').send({ username: 'real', password: 'correct' })
    //const cookie = login.headers['set-cookie'][0]
    const response = await request(app.callback())
      .post('/review')
      //.set('Cookie', cookie)
      .send({
        game: 'id',
        rating: '1',
        body: 'test'
      })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toEqual({ success: true })
    done()
  })
})
