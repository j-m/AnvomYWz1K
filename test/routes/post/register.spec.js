const supertest = require('supertest')
const app = require('../../../src/app/koa.js')
const connection = require('../../../src/database/connection.js')

jest.mock('../../../src/routes/post/util/validateUsername')
const validateUsername = require('../../../src/routes/post/util/validateUsername')

beforeAll(async () => {
  jest.resetModules()
  process.env.DATABASE = ':memory:'
  process.env.SALT_ROUNDS = 12
  process.env.MINIMUM_PASSWORD_LENGTH = 10
  await connection.open()
})

afterAll(async () => {
  await connection.close()
})

describe('routes post register', () => {
  test('requires email', async done => {
    supertest(app.callback())
      .post('/register')
      .send({ })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((error, response) => {
        if (error) { return done(error) }
        expect(response.body).toEqual({ success: false, message: 'NEW_EMAIL_MISSING' })
        done()
      })
  })

  test('validates username', async done => {
    supertest(app.callback())
      .post('/register')
      .send({ email: 'test@test.test' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((error, response) => {
        if (error) { return done(error) }
        expect(validateUsername).toHaveBeenCalled()
        done()
      })
  })

  test('requires password', async done => {
    supertest(app.callback())
      .post('/register')
      .send({ email: 'test@test.test', username: 'real' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((error, response) => {
        if (error) { return done(error) }
        expect(response.body).toEqual({ success: false, message: 'NEW_PASSWORD_MISSING' })
        done()
      })
  })

  test('password minimum length', async done => {
    supertest(app.callback())
      .post('/register')
      .send({ email: 'test@test.test', username: 'real', password: 'short' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((error, response) => {
        if (error) { return done(error) }
        expect(response.body).toEqual({ success: false, message: 'NEW_PASSWORD_TOO_SHORT' })
        done()
      })
  })

  test('adds user to database', async done => {
    supertest(app.callback())
      .post('/register')
      .send({ email: 'test@test.test', username: 'real', password: 'longenough' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(async (error, response) => {
        if (error) { return done(error) }
        expect(response.body).toEqual({ success: true })
        expect((await connection.all('select.memberByUsername', 'real')).length).toEqual(1)
        connection.run('delete.memberByUsername', 'real')
        done()
      })
  })
})
