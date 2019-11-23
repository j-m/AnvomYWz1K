'use strict'

const connection = require('../../src/database/connection')
const Review = require('../../src/models/review')
const Comment = require('../../src/models/comment')

describe('database models member', () => {
  beforeAll(async() => {
    jest.resetModules()
    process.env.DATABASE = ':memory:'
    await connection.open()
    await Promise.all([
      connection.run('insert.game', ...[
        'gameID',
        'steamAppId',
        'title',
        'summary', null, null, null, null, null, null, null, null
      ]),
      connection.run('insert.member', 'any', 'userID', 'any')
    ])
  })

  afterAll(async() => {
    await connection.close()
  })

  describe('.create', () => {
    test('inserts a row into the comments table', async done => {
      await connection.run('insert.review', 'gameID', 'userID', '1', 'review body', 'short')
      const comment = await new Comment()
      await comment.create({game: 'gameID', author: 'userID', type: 'short'}, 'author', 'body')
      const comments = await connection.all('select.comments', 'gameID', 'userID', 'short')
      expect(comments.length).toEqual(1)
      done()
    })
  })
})
