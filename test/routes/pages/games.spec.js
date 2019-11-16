'use strict'

const request = require('supertest')

const app = require('../../../src/app/koa')
const connection = require('../../../src/database/connection')

beforeAll(async() => {
  jest.resetModules()
  process.env.DATABASE = ':memory:'
  await connection.open()
})

afterAll(async() => {
  await connection.close()
})

describe('routes get games', () => {
  test('should contain templated text', async() => {
    const response = await request(app.callback()).get('/games/')
    expect(response.text).toMatchSnapshot()
  })
})
