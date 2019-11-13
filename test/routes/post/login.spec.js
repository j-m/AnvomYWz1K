const supertest = require('supertest')
const app = require('../../../src/app/koa.js')
const connection = require('../../../src/database/connection.js')

let originalDatabaseName = process.env.DATABASE

beforeAll(async () => {
  jest.resetModules()
  originalDatabaseName = process.env.DATABASE
  process.env.DATABASE = ':memory:'
  await connection.open()
  await connection.run('insert.member', 'test@test.test', 'real', '$2a$12$mRK3BPWwiklKSgj9HozTuuCtKi0icbiHHkX2ruBcmSdhNVuykgNnG')
})

afterAll(async () => {
  await connection.run('delete.memberByUsername', 'real')
  await connection.close()
  process.env.DATABASE = originalDatabaseName
})

describe('routes post login', () => {
  test('requires username', async done => {
    supertest(app.callback())
      .post('/login')
      .send({ })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((error, response) => {
        if (error) { return done(error) }
        expect(response.body).toEqual({ success: false, message: 'USERNAME_MISSING' })
        done()
      })
  })

  test('requires password', async done => {
    supertest(app.callback())
      .post('/login')
      .send({ username: 'fake' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((error, response) => {
        if (error) { return done(error) }
        expect(response.body).toEqual({ success: false, message: 'PASSWORD_MISSING' })
        done()
      })
  })

  test('checks username is known', async done => {
    supertest(app.callback())
      .post('/login')
      .send({ username: 'fake', password: 'incorrect' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((error, response) => {
        if (error) { return done(error) }
        expect(response.body).toEqual({ success: false, message: 'USERNAME_UNKNOWN' })
        done()
      })
  })

  test('checks password is incorrect', async done => {
    supertest(app.callback())
      .post('/login')
      .send({ username: 'real', password: 'incorrect' })
      .expect('Content-Type', /json/)
      .end((error, response) => {
        if (error) { return done(error) }
        expect(response.body).toEqual({ success: false, message: 'PASSWORD_INCORRECT' })
        done()
      })
  })

  test('returns success if password is correct for that username', async done => {
    supertest(app.callback())
      .post('/login')
      .send({ username: 'real', password: 'correct' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((error, response) => {
        if (error) { return done(error) }
        expect(response.body).toEqual({ success: true })
        done()
      })
  })
})
