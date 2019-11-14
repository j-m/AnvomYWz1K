const request = require('supertest')

const app = require('../../../src/app/koa.js')

describe('routes get index', () => {
  test('should contain templated text', async () => {
    const response = await request(app.callback()).get('/')
    expect(response.body).toMatchSnapshot()
  })
})
