'use strict'

const request = require('supertest')

const app = require('../../../src/app/koa')

describe('routes get index', () => {
  test('should contain templated text', async() => {
    const response = await request(app.callback()).get('/')
    expect(response.status).toEqual(301)
    expect(response.type).toEqual('text/html')
    expect(response.text).toEqual('Redirecting to <a href="/games/">/games/</a>.')
  })
})
