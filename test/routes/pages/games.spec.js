const request = require('supertest')

const app = require('../../../src/app/koa.js')

describe('routes get games', () => {
  test('should contain templated text', async () => {
    const response = await request(app.callback()).get('/games/')
    expect(response.body).toMatchSnapshot()
  })
})
