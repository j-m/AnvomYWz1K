const request = require('supertest')

const app = require('../../../src/app/koa')
const connection = require('../../../src/database/connection')

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
    const response = await request(app.callback()).post('/register').send({ })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toEqual({ success: false, message: 'NEW_EMAIL_MISSING' })
    done()
  })

  test('validates username', async done => {
    const response = await request(app.callback()).post('/register').send({ email: 'test@test.test' })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toEqual({ success: false, message: 'NEW_USERNAME_MISSING' })
    done()
  })

  test('requires password', async done => {
    const response = await request(app.callback()).post('/register').send({ email: 'test@test.test', username: 'real' })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toEqual({ success: false, message: 'NEW_PASSWORD_MISSING' })
    done()
  })

  test('password minimum length', async done => {
    const response = await request(app.callback()).post('/register').send({ email: 'test@test.test', username: 'real', password: 'short' })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toEqual({ success: false, message: 'NEW_PASSWORD_TOO_SHORT' })
    done()
  })

  test('adds user to database', async done => {
    const response = await request(app.callback()).post('/register').send({ email: 'test@test.test', username: 'real', password: 'longenough' })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toEqual({ success: true })
    expect((await connection.all('select.memberByUsername', 'real')).length).toEqual(1)
    connection.run('delete.memberByUsername', 'real')
    done()
  })
})
