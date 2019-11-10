const connection = require('../../src/database/connection.js')

describe('database', () => {
  describe('connection', () => {
    describe('.close()', () => {
      test('does not throw if close before opening', async done => {
        await connection.close()
        done()
      })
    })
  })
})
