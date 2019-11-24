'use strict'

const request = require('supertest')

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
        'idUnique',
        'steamAppIDUnique',
        'titleUnique',
        'summary',
        'developer',
        'publisher',
        'description',
        'tags',
        'releaseDate',
        'store',
        'thumbnail',
        'banner'
      ]),
      connection.run('insert.member', 'any', '1', 'any'),
      connection.run('insert.member', 'any', '2', 'any'),
      connection.run('insert.member', 'any', '3', 'any'),
      connection.run('insert.member', 'any', '4', 'any'),
      connection.run('insert.member', 'any', '5', 'any'),
      connection.run('insert.member', 'any', '6', 'any'),
      connection.run('insert.member', 'any', '7', 'any'),
      connection.run('insert.member', 'any', '8', 'any'),
    ])
  })

  afterAll(async() => {
    await Promise.all[
      connection.run('delete.memberByUsername', '1'),
      connection.run('delete.memberByUsername', '2'),
      connection.run('delete.memberByUsername', '3'),
      connection.run('delete.memberByUsername', '4'),
      connection.run('delete.memberByUsername', '5'),
      connection.run('delete.memberByUsername', '6'),
      connection.run('delete.memberByUsername', '7'),
      connection.run('delete.memberByUsername', '8'),
      connection.run('delete.gameByID', 'idUnique'),
      connection.run('delete.gameByID', 'id')
    ]
    await connection.close()
  })

  test('should contain templated text with generated thumbnail, banner, and store', async() => {
    const response = await request(app.callback()).get('/games/id')
    expect(response.text).toMatchSnapshot()
  })

  test('should contain templated text with defined thumbnail, banner, and store', async() => {
    const response = await request(app.callback()).get('/games/idUnique')
    expect(response.text).toMatchSnapshot()
  })

  test('with only positive short reviews', async() => {
    await connection.run('insert.review', 'idUnique', '1', '1', 'body', 'short')
    const response = await request(app.callback()).get('/games/idUnique')
    expect(scrubSnapshot(response.text)).toMatchSnapshot()
    await connection.run('delete.review', 'idUnique', '1',' short')
  })

  test('with only negative short reviews', async() => {
    await connection.run('insert.review', 'id', '2', '-1', 'body', 'short')
    const response = await request(app.callback()).get('/games/id')
    expect(scrubSnapshot(response.text)).toMatchSnapshot()
    await connection.run('delete.review', 'id', '2',' short')
  })

  test('with positive and negative short reviews', async() => {
    await connection.run('insert.review', 'idUnique', '3', '1', 'body', 'short')
    await connection.run('insert.review', 'idUnique', '4', '-1', 'body', 'short')
    const response = await request(app.callback()).get('/games/idUnique')
    expect(scrubSnapshot(response.text)).toMatchSnapshot()
    await connection.run('delete.review', 'idUnique', '3',' short')
    await connection.run('delete.review', 'idUnique', '4',' short')
  })

  test('with multiple pages of short reviews', async() => {
    await Promise.all([
      connection.run('insert.review', 'idUnique', '5', '1', 'body', 'short'),
      connection.run('insert.review', 'idUnique', '6', '-1', 'body', 'short'),
      connection.run('insert.review', 'idUnique', '7', '1', 'body', 'short'),
      connection.run('insert.review', 'idUnique', '8', '-1', 'body', 'short')
    ])
    const response = await request(app.callback()).get('/games/idUnique')
    expect(scrubSnapshot(response.text)).toMatchSnapshot()
    await Promise.all([
      connection.run('delete.review', 'idUnique', '5',' short'),
      connection.run('delete.review', 'idUnique', '6',' short'),
      connection.run('delete.review', 'idUnique', '7',' short'),
      connection.run('delete.review', 'idUnique', '8',' short')
    ])
  })

  test('with multiple pages of long reviews', async() => {
    await Promise.all([
      connection.run('insert.review', 'idUnique', '5', '10', 'body', 'long'),
      connection.run('insert.review', 'idUnique', '6', '11', 'body', 'long'),
      connection.run('insert.review', 'idUnique', '7', '96', 'body', 'long'),
      connection.run('insert.review', 'idUnique', '8', '43', 'body', 'long')
    ])
    const response = await request(app.callback()).get('/games/idUnique')
    expect(scrubSnapshot(response.text)).toMatchSnapshot()
    await Promise.all([
      connection.run('delete.review', 'idUnique', '5',' long'),
      connection.run('delete.review', 'idUnique', '6',' long'),
      connection.run('delete.review', 'idUnique', '7',' long'),
      connection.run('delete.review', 'idUnique', '8',' long')
    ])
  })
})
