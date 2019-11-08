const request = require('supertest')
const app = require('../src/app.js')
const server = require('../src/server.js')

afterEach(async () => {
  server.close()
})

describe('route', () => {
  describe('index', () => {
    test('should contain templated text', async done => {
      const response = await request(app.callback()).get('/')
      expect(response).toBeDefined()
      expect(response.text).toContain("<h1>This should say 'test': test</h1>")
      done()
    })
  })
})
