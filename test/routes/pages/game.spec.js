'use strict'

const request = require('supertest')

jest.mock('../../../src/routes/util/Session')
const Session = require('../../../src/routes/util/Session')

const app = require('../../../src/app/koa')
const connection = require('../../../src/database/connection')
const scrubSnapshot = require('../../../src/test/util/scrubSnapshot')

describe('routes get game', () => {
  beforeAll(async() => {
    jest.resetModules()
    process.env.DATABASE = ':memory:'
    process.env.REVIEWS_PER_PAGE = '2'
    await connection.open()
    await Promise.all([
      connection.run('insert.game', ...[
        'id',
        'steamAppId',
        'title',
        'summary', null, null, null, null, null, null, null, null
      ]),
      connection.run('insert.game', ...[
        'game2',
        'steamAppgame2',
        'titleUnique',
        'summary',
        'developer',
        'publisher',
        'description',
        'category',
        'releaseDate',
        'store',
        'thumbnail',
        'banner'
      ]),
      connection.run('insert.member', 'any', '1', 'any'),
      connection.run('insert.member', 'any', '2', 'any'),
      connection.run('insert.member', 'any', '3', 'any'),
      connection.run('insert.member', 'any', '4', 'any'),
      connection.run('insert.member', 'any', 'member5', 'any'),
      connection.run('insert.member', 'any', 'member6', 'any'),
      connection.run('insert.member', 'any', 'member7', 'any'),
      connection.run('insert.member', 'any', 'member8', 'any'),
    ])
  })

  afterAll(async() => {
    await Promise.all[
      connection.run('delete.memberByUsername', '1'),
      connection.run('delete.memberByUsername', '2'),
      connection.run('delete.memberByUsername', '3'),
      connection.run('delete.memberByUsername', '4'),
      connection.run('delete.memberByUsername', 'member5'),
      connection.run('delete.memberByUsername', 'member6'),
      connection.run('delete.memberByUsername', 'member7'),
      connection.run('delete.memberByUsername', 'member8'),
      connection.run('delete.gameByID', 'game2'),
      connection.run('delete.gameByID', 'id')
    ]
    await connection.close()
  })

  test('should contain templated text with generated thumbnail, banner, and store', async() => {
    const response = await request(app.callback()).get('/games/id')
    expect(response.status).toEqual(200)
    expect(response.text).toMatchSnapshot()
  })

  test('should contain templated text with defined thumbnail, banner, and store', async() => {
    const response = await request(app.callback()).get('/games/game2')
    expect(response.status).toEqual(200)
    expect(response.text).toMatchSnapshot()
  })

  test('with only positive short reviews', async() => {
    await connection.run('insert.review', 'game2', '1', '1', 'body', 'short')
    const response = await request(app.callback()).get('/games/game2')
    expect(response.status).toEqual(200)
    expect(scrubSnapshot(response.text)).toMatchSnapshot()
    await connection.run('delete.review', 'game2', '1',' short')
  })

  test('with only negative short reviews', async() => {
    await connection.run('insert.review', 'id', '2', '-1', 'body', 'short')
    const response = await request(app.callback()).get('/games/id')
    expect(response.status).toEqual(200)
    expect(scrubSnapshot(response.text)).toMatchSnapshot()
    await connection.run('delete.review', 'id', '2',' short')
  })

  test('with positive and negative short reviews', async() => {
    await connection.run('insert.review', 'game2', '3', '1', 'body', 'short')
    await connection.run('insert.review', 'game2', '4', '-1', 'body', 'short')
    const response = await request(app.callback()).get('/games/game2')
    expect(response.status).toEqual(200)
    expect(scrubSnapshot(response.text)).toMatchSnapshot()
    await connection.run('delete.review', 'game2', '3',' short')
    await connection.run('delete.review', 'game2', '4',' short')
  })

  test('with multiple pages of short reviews', async() => {
    await Promise.all([
      connection.run('insert.review', 'game2', 'member5', '1', 'body', 'short'),
      connection.run('insert.review', 'game2', 'member6', '-1', 'body', 'short'),
      connection.run('insert.review', 'game2', 'member7', '1', 'body', 'short'),
      connection.run('insert.review', 'game2', 'member8', '-1', 'body', 'short')
    ])
    const response = await request(app.callback()).get('/games/game2')
    expect(response.status).toEqual(200)
    expect(scrubSnapshot(response.text)).toMatchSnapshot()
    await Promise.all([
      connection.run('delete.review', 'game2', 'member5',' short'),
      connection.run('delete.review', 'game2', 'member6',' short'),
      connection.run('delete.review', 'game2', 'member7',' short'),
      connection.run('delete.review', 'game2', 'member8',' short')
    ])
  })

  test('public review', async() => {
    await connection.run('insert.member', 'email', 'memberPublic', 'password'),
    await connection.run('insert.review', 'game2', 'memberPublic', '10', 'body', 'long'),
    await connection.run('update.visibility', 'public', 'game2', 'memberPublic', 'long')
    const response = await request(app.callback()).get('/games/game2')
    expect(response.status).toEqual(200)
    expect(scrubSnapshot(response.text)).toMatchSnapshot()
  })

  test('author review', async() => {
    Session.mockImplementation(() => ({
      authorised: true,
      username: 'memberAuthor',
      privileges: 'moderator',
      administrator: false,
      moderator: true
    }))
    await connection.run('insert.member', 'email', 'memberAuthor', 'password'),
    await connection.run('insert.review', 'game2', 'memberAuthor', '10', 'body', 'long'),
    await connection.run('update.visibility', 'author', 'game2', 'memberAuthor', 'long')
    const response = await request(app.callback()).get('/games/game2')
    expect(response.status).toEqual(200)
    expect(scrubSnapshot(response.text)).toMatchSnapshot()
  })

  test('moderator review', async() => {
    Session.mockImplementation(() => ({
      authorised: true,
      username: 'userID',
      privileges: 'moderator',
      administrator: false,
      moderator: true
    }))
    await connection.run('insert.member', 'email', 'memberModerator', 'password'),
    await connection.run('insert.review', 'game2', 'memberModerator', '10', 'body', 'long'),
    await connection.run('update.visibility', 'moderator', 'game2', 'memberModerator', 'long')
    const response = await request(app.callback()).get('/games/game2')
    expect(response.status).toEqual(200)
    expect(scrubSnapshot(response.text)).toMatchSnapshot()
  })
})
