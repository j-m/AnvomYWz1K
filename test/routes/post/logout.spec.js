const request = require('supertest')

const app = require('../../../src/app/koa')
const connection = require('../../../src/database/connection')

beforeAll(async () => {
  jest.resetModules()
  process.env.DATABASE = ':memory:'
  await connection.open()
})

afterAll(async () => {
  await connection.close()
})

describe('routes post logout', () => {
  test('should clear session', async done => {
    const response = await request(app.callback()).post('/logout').send({ })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toEqual({ success: true })
    done()
  })
})
