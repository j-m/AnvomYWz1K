'use strict'

const connection = require('../../src/database/connection')
const Comment = require('../../src/models/comment')
const ErrorEnum = require('../../src/util/ErrorEnum')

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
    await connection.run('insert.review', 'gameID', 'userID', '1', 'review', 'short')
  })

  afterAll(async() => {
    await connection.close()
  })

  describe('.create', () => {
    test('requires author', async done => {
      const comment = await new Comment()
      await expect(
        comment.create()
      ).rejects.toThrow(ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING)
      done()
    })

    test('requires data', async done => {
      const comment = await new Comment()
      await expect(
        comment.create('author')
      ).rejects.toThrow(ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING)
      done()
    })

    test('requires review game', async done => {
      const comment = await new Comment()
      await expect(
        comment.create('author', {})
      ).rejects.toThrow(ErrorEnum.COMMENT_REVIEW_GAME_MISSING)
      done()
    })

    test('requires review author', async done => {
      const comment = await new Comment()
      await expect(
        comment.create('author', {game: 'gameID'})
      ).rejects.toThrow(ErrorEnum.COMMENT_REVIEW_AUTHOR_MISSING)
      done()
    })

    test('requires review type', async done => {
      const comment = await new Comment()
      await expect(
        comment.create('author', {game: 'gameID', author: 'author'})
      ).rejects.toThrow(ErrorEnum.COMM)
      done()
    })

    test('inserts a row into the comments table', async done => {
      const comment = await new Comment()
      await comment.create('author', {game: 'gameID', author: 'userID', type: 'short', body: 'body'})
      const comments = await connection.all('select.comments', 'gameID', 'userID', 'short')
      expect(comments.length).toEqual(1)
      done()
    })
  })
})
