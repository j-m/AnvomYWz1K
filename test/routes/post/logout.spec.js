const supertest = require('supertest')
const app = require('../../../src/app/koa.js')
const connection = require('../../../src/database/connection.js')

let originalDatabaseName = process.env.DATABASE

beforeAll(async () => {
  jest.resetModules()
  originalDatabaseName = process.env.DATABASE
  process.env.DATABASE = ':memory:'
  await connection.open()
})

afterAll(async () => {
  await connection.close()
  process.env.DATABASE = originalDatabaseName
})

describe('routes post logout', () => {
  test('should clear session', async done => {
    supertest(app.callback())
      .post('/logout')
      .send({ })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((error, response) => {
        if (error) { return done(error) }
        expect(response.body).toEqual({ success: true })
        done()
      })
  })
})
