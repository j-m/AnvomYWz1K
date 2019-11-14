const request = require('supertest')

const app = require('../../../src/app/koa.js')
const connection = require('../../../src/database/connection.js')

beforeAll(async () => {
  jest.resetModules()
  process.env.DATABASE = ':memory:'
  await connection.open()
  await connection.run('insert.member', 'test@test.test', 'real', '$2a$12$mRK3BPWwiklKSgj9HozTuuCtKi0icbiHHkX2ruBcmSdhNVuykgNnG')
})

afterAll(async () => {
  await connection.run('delete.memberByUsername', 'real')
  await connection.close()
})

describe('routes post username', () => {
  test('returns error message from validateUsername', async done => {
    const response = await request(app.callback()).post('/username').send({ username: 'real' })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toEqual({ success: false, message: 'NEW_USERNAME_IN_USE' })
    done()
  })

  test('returns success if username is available', async done => {
    const response = await request(app.callback()).post('/username').send({ username: 'free' })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toEqual({ success: true })
    done()
  })
})
