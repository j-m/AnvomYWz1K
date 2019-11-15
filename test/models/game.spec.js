const connection = require('../../src/database/connection')
const Game = require('../../src/models/game')
const ErrorEnum = require('../../src/util/ErrorEnum')

describe('database models game', () => {
  beforeAll(async () => {
    jest.resetModules()
    process.env.DATABASE = ':memory:'
    await connection.open()
  })

  afterAll(async () => {
    await connection.close()
  })

  describe('.create', () => {
    test('throws if game missing', async done => {
      const game = await new Game()
      await expect(game.create()).rejects.toThrow(ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING)
      done()
    })

    test('throws if game title missing', async done => {
      const game = await new Game()
      await expect(game.create({ })).rejects.toThrow(ErrorEnum.GAME_TITLE_MISSING)
      done()
    })

    test('throws if game summary missing', async done => {
      const game = await new Game()
      await expect(game.create({ title: 'title' })).rejects.toThrow(ErrorEnum.GAME_SUMMARY_MISSING)
      done()
    })

    test('throws if game thumbnail missing', async done => {
      const game = await new Game()
      await expect(game.create({ title: 'title', summary: 'summary' })).rejects.toThrow(ErrorEnum.GAME_THUMBNAIL_MISSING)
      connection.run('delete.gameByTitle', 'title')
      done()
    })

    test('throws if game title not unique', async done => {
      await connection.run('insert.game', 'id', 'title', 'summary', 'thumbnail')
      const game = await new Game()
      await expect(game.create({ title: 'title', summary: 'summary', thumbnail: 'thumbnail' })).rejects.toThrow(ErrorEnum.GAME_TITLE_IN_USE)
      connection.run('delete.gameByTitle', 'title')
      done()
    })

    test('successfully inserts a row into the games table', async done => {
      const game = await new Game()
      await game.create({ title: 'title', summary: 'summary', thumbnail: 'thumbnail' })
      const records = await connection.all('select.gameByTitle', 'title')
      expect(records.length).toEqual(1)
      connection.run('delete.gameByTitle', 'title')
      done()
    })
  })

  describe('.get', () => {
    test('throws if not found', async done => {
      const game = await new Game()
      await expect(game.get('title')).rejects.toThrow(ErrorEnum.GAME_UNKNOWN)
      done()
    })

    test('finds a game by title', async done => {
      await connection.run('insert.game', 'id', 'title', 'summary', 'thumbnail')
      const game = await new Game()
      await game.get('title')
      expect(game.loaded).toEqual(true)
      connection.run('delete.gameByTitle', 'title')
      done()
    })
  })

  describe('.updateRecord', () => {
    test('throws if not loaded', async done => {
      const game = await new Game()
      await expect(game.updateRecord()).rejects.toThrow(ErrorEnum.GAME_NOT_LOADED)
      done()
    })

    test('updates a field', async done => {
      await connection.run('insert.game', 'id', 'title', 'summary', 'thumbnail')
      const game = await new Game()
      await game.get('title')
      expect(game.loaded).toEqual(true)
      game.title = 'new title'
      const previousRecords = await connection.all('select.gameByID', 'id')
      expect(previousRecords[0].title).toEqual('title')
      await game.updateRecord()
      const records = await connection.all('select.gameByID', 'id')
      expect(records[0].title).toEqual('new title')
      connection.run('delete.gameByID', 'id')
      done()
    })
  })
})
