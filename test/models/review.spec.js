'use strict'

const connection = require('../../src/database/connection')
const Review = require('../../src/models/review')
const ErrorEnum = require('../../src/util/ErrorEnum')

describe('database models review', () => {
  beforeAll(async() => {
    jest.resetModules()
    process.env.DATABASE = ':memory:'
    await connection.open()
  })

  afterAll(async() => {
    await connection.close()
  })

  describe('.create', () => {
    test('throws if review missing', async done => {
      const review = await new Review()
      await expect(review.load()).rejects.toThrow(ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING)
      done()
    })

    test('throws if game missing', async done => {
      const review = await new Review()
      await expect(review.load({ })).rejects.toThrow(ErrorEnum.REVIEW_GAME_MISSING)
      done()
    })

    test('throws if author missing', async done => {
      const review = await new Review()
      await expect(
        review.load({ game: 'game' })
      ).rejects.toThrow(ErrorEnum.REVIEW_AUTHOR_MISSING)
      done()
    })

    test('throws if body missing', async done => {
      const review = await new Review()
      await expect(
        review.load({ game: 'game', author: 'author' })
      ).rejects.toThrow(ErrorEnum.REVIEW_BODY_MISSING)
      connection.run('delete.gameByTitle', 'title')
      done()
    })

    test('throws if type missing', async done => {
      const review = await new Review()
      await expect(
        review.load({ game: 'game', author: 'author', body: 'body' })
      ).rejects.toThrow(ErrorEnum.REVIEW_TYPE_MISSING)
      connection.run('delete.gameByTitle', 'title')
      done()
    })

    test('throws if rating missing', async done => {
      const review = await new Review()
      await expect(
        review.load({ game: 'game', author: 'author', body: 'body', type: 'short' })
      ).rejects.toThrow(ErrorEnum.REVIEW_RATING_MISSING)
      connection.run('delete.gameByTitle', 'title')
      done()
    })

    test('throws if unexpected property', async done => {
      const review = await new Review()
      await expect(
        review.load({ game: 'game', author: 'author', body: 'body', type: 'short', rating: '1',food: 'cheese' })
      ).rejects.toThrow(ErrorEnum.REVIEW_UNEXPECTED_KEY)
      done()
    })

    test('successfully inserts a row into the reviews table', async done => {
      const review = await new Review()
      await review.load({ game: 'game', author: 'author', body: 'body', type: 'short', rating: '1' })
      const records = await connection.all('select.review', 'game', 'author', 'short')
      expect(records.length).toEqual(1)
      connection.run('delete.review', 'game', 'author', 'short')
      done()
    })

    test('updates review if it already exists', async done => {
      const review = await new Review()
      await review.load({ game: 'game', author: 'author', body: 'body', type: 'short', rating: '1' })
      await review.load({ game: 'game', author: 'author', body: 'new body', type: 'short', rating: '1' })
      const records = await connection.all('select.review', 'game', 'author', 'short')
      expect(records.length).toEqual(1)
      expect(records[0].body).toEqual('new body')
      connection.run('delete.review', 'game', 'author', 'short')
      done()
    })
  })
})
