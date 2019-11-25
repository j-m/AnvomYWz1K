'use strict'

process.env.DATABASE = ':memory:'

const connection = require('../../src/database/connection')
const Review = require('../../src/models/review')
const ErrorEnum = require('../../src/util/ErrorEnum')

beforeAll(async done => {
  await connection.open()
  done()
})

afterAll(async done => {
  await connection.close()
  done()
})

describe('database models review', () => {
  describe('.load', () => {
    test('throws if author missing', async done => {
      const review = new Review()
      await expect(review.load()).rejects.toThrow(ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING)
      done()
    })

    test('throws if data missing', async done => {
      const review = new Review()
      await expect(review.load('author')).rejects.toThrow(ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING)
      done()
    })

    test('throws if game missing', async done => {
      const review = new Review()
      await expect(review.load('author', {})).rejects.toThrow(ErrorEnum.REVIEW_GAME_MISSING)
      done()
    })

    test('throws if type missing', async done => {
      const review = new Review()
      await expect(
        review.load('author', { game: 'game' })
      ).rejects.toThrow(ErrorEnum.REVIEW_TYPE_MISSING)
      done()
    })

    test('throws if rating missing', async done => {
      const review = new Review()
      await expect(
        review.load('author', { game: 'game', type: 'short' })
      ).rejects.toThrow(ErrorEnum.REVIEW_RATING_MISSING)
      connection.run('delete.gameByTitle', 'title')
      done()
    })

    test('throws if body missing', async done => {
      const review = new Review()
      await expect(
        review.load('author', { game: 'game', type: 'short', rating: 1 })
      ).rejects.toThrow(ErrorEnum.REVIEW_BODY_MISSING)
      connection.run('delete.gameByTitle', 'title')
      done()
    })

    test('successfully inserts a row into the reviews table', async done => {
      const review = new Review()
      await review.load('author', { game: 'game', body: 'body', type: 'short', rating: '1' })
      const records = await connection.all('select.review', 'game', 'author', 'short')
      expect(records.length).toEqual(1)
      connection.run('delete.review', 'game', 'author', 'short')
      done()
    })

    test('updates review if it already exists', async done => {
      const review = new Review()
      await review.load('author', { game: 'game', body: 'body', type: 'short', rating: '1' })
      await review.load('author', { game: 'game', body: 'new body', type: 'short', rating: '1' })
      const records = await connection.all('select.review', 'game', 'author', 'short')
      expect(records.length).toEqual(1)
      expect(records[0].body).toEqual('new body')
      connection.run('delete.review', 'game', 'author', 'short')
      done()
    })
  })

  describe('.visibility', () => {
    test('throws if data missing', async done => {
      const review = new Review()
      await expect(review.visibility()).rejects.toThrow(ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING)
      done()
    })

    test('throws if data.game missing', async done => {
      const review = new Review()
      await expect(review.visibility({ })).rejects.toThrow(ErrorEnum.REVIEW_GAME_MISSING)
      done()
    })

    test('throws if data.author missing', async done => {
      const review = new Review()
      await expect(review.visibility({game: 'game'})).rejects.toThrow(ErrorEnum.REVIEW_AUTHOR_MISSING)
      done()
    })

    test('throws if type missing', async done => {
      const review = new Review()
      await expect(
        review.visibility({ game: 'game', author: 'author'})
      ).rejects.toThrow(ErrorEnum.REVIEW_TYPE_MISSING)
      done()
    })

    test('throws if visibility missing', async done => {
      const review = new Review()
      await expect(
        review.visibility({ game: 'game', author: 'author', type: 'short'})
      ).rejects.toThrow(ErrorEnum.REVIEW_VISIBILITY_MISSING)
      done()
    })

    test('throws if review missing', async done => {
      const review = new Review()
      await expect(
        review.visibility({ game: 'game', author: 'fake', type: 'short', visibility: 'public'})
      ).rejects.toThrow(ErrorEnum.REVIEW_NOT_FOUND)
      done()
    })

    test('can change review visibility to public as a moderator', async done => {
      const review = new Review()
      await review.load('different', { game: 'game', body: 'body', type: 'long', rating: '95' })
      await review.visibility(
        { game: 'game', author: 'different', type: 'long', visibility: 'public'},
        'userID', 'moderator')
      const records = await connection.all('select.review', 'game', 'different', 'long')
      expect(records[0].visibility).toEqual('public')
      done()
    })

    test('cannot change review visibility to public with no privileges', async done => {
      const review = new Review()
      await review.load('different', { game: 'game', body: 'body', type: 'long', rating: '95' })
      await expect(
        review.visibility(
          { game: 'game', author: 'different', type: 'long', visibility: 'public'},
          'userID', 'none')
      ).rejects.toThrow(ErrorEnum.REVIEW_INSUFFICIENT_PRIVILEGES)
      done()
    })

    test('cannot change review visibility to author with no privileges', async done => {
      const review = new Review()
      await review.load('different', { game: 'game', body: 'body', type: 'long', rating: '95' })
      await expect(
        review.visibility(
          { game: 'game', author: 'different', type: 'long', visibility: 'author'},
          'userID', 'none')
      ).rejects.toThrow(ErrorEnum.REVIEW_INSUFFICIENT_PRIVILEGES)
      done()
    })

    test('cannot change review visibility to author if not the author', async done => {
      const review = new Review()
      await review.load('different', { game: 'game', body: 'body', type: 'long', rating: '95' })
      await expect(
        review.visibility(
          { game: 'game', author: 'different', type: 'long', visibility: 'author'},
          'userID', 'moderator')
      ).rejects.toThrow(ErrorEnum.REVIEW_INSUFFICIENT_PRIVILEGES)
      done()
    })

    test('can change review visibility to author', async done => {
      const review = new Review()
      await review.load('authorReview', { game: 'game', body: 'body', type: 'long', rating: '95' })
      await review.visibility(
        { game: 'game', author: 'authorReview', type: 'long', visibility: 'author'},
        'authorReview', 'moderator')
      const records = await connection.all('select.review', 'game', 'authorReview', 'long')
      expect(records[0].visibility).toEqual('author')
      done()
    })

    test('change review visibility to moderator with moderator privileges', async done => {
      const review = new Review()
      await review.load('different', { game: 'game', body: 'body', type: 'long', rating: '95' })
      await review.visibility(
        { game: 'game', author: 'different', type: 'long', visibility: 'moderator'},
        'userID', 'moderator')
      const records = await connection.all('select.review', 'game', 'different', 'long')
      expect(records[0].visibility).toEqual('moderator')
      done()
    })

    test('cannot change review visibility to moderator with no privileges', async done => {
      const review = new Review()
      await review.load('different', { game: 'game', body: 'body', type: 'long', rating: '95' })
      await expect(
        review.visibility(
          { game: 'game', author: 'different', type: 'long', visibility: 'public'},
          'userID', 'none')
      ).rejects.toThrow(ErrorEnum.REVIEW_INSUFFICIENT_PRIVILEGES)
      done()
    })

    test('cannot change review visibility to moderator with no privileges', async done => {
      const review = new Review()
      await review.load('different', { game: 'game', body: 'body', type: 'long', rating: '95' })
      await expect(
        review.visibility(
          { game: 'game', author: 'different', type: 'long', visibility: 'public'},
          'userID', 'none')
      ).rejects.toThrow(ErrorEnum.REVIEW_INSUFFICIENT_PRIVILEGES)
      done()
    })
  })
})
