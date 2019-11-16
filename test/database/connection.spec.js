'use strict'

const connection = require('../../src/database/connection')

describe('database connection', () => {
  describe('.close()', () => {
    test('does not throw if close before opening', async done => {
      await connection.close()
      done()
    })
  })
})
