'use strict'

const request = require('supertest')

const app = require('../../../src/app/koa')
const connection = require('../../../src/database/connection')

beforeAll(async() => {
  jest.resetModules()
  process.env.DATABASE = ':memory:'
  await connection.open()
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

describe('routes post login', () => {
  test('requires username', async done => {
    const response = await request(app.callback()).post('/login').send({ })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toEqual({ success: false, code: 'USERNAME_MISSING' })
    done()
  })

  test('requires password', async done => {
    const response = await request(app.callback()).post('/login').send({ username: 'fake' })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toEqual({ success: false, code: 'PASSWORD_MISSING' })
    done()
  })

  test('checks username is known', async done => {
    const response = await request(app.callback()).post('/login').send({ username: 'fake', password: 'incorrect' })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toEqual({ success: false, code: 'USERNAME_UNKNOWN' })
    done()
  })

  test('checks password is incorrect', async done => {
    const response = await request(app.callback()).post('/login').send({ username: 'real', password: 'incorrect' })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toEqual({ success: false, code: 'PASSWORD_INCORRECT' })
    done()
  })

  test('returns success if password is correct for that username', async done => {
    const response = await request(app.callback()).post('/login').send({ username: 'real', password: 'correct' })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toEqual({ success: true })
    expect(response.headers['set-cookie'].length).toEqual(1)
    done()
  })
})
