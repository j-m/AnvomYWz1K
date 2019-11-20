'use strict'

const authorisation = require('../../../../src/routes/pages/util/authorisation')

describe('routes pages util authorisation', () => {
  test('does not set moderator and administrator if privileges are none', async done => {
    expect(authorisation({
      session: { username: 'username', privileges: 'none' }
    }, {})).toEqual({ username: 'username' })
    done()
  })

  test('sets moderator true if privileges are moderator', async done => {
    expect(authorisation({
      session: { username: 'username', privileges: 'moderator' }
    }, {})).toEqual({ moderator: true, username: 'username' })
    done()
  })

  test('sets moderator and administrator true if privileges are administrator', async done => {
    expect(authorisation({
      session: { username: 'username', privileges: 'administrator' }
    }, {})).toEqual({ administrator: true, moderator: true, username: 'username' })
    done()
  })
})
