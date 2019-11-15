var randomstring = require('randomstring')

const connection = require('../database/connection')
const ErrorEnum = require('../util/ErrorEnum')

async function generateID () {
  let results
  let id
  while (results === undefined || results.length !== 0) {
    id = randomstring.generate(8)
    results = await connection.all('select.gameByID', id)
  }
  return id
}

class Game {
  get data () {
    return [
      this.title,
      this.summary,
      this.thumbnail,
      this.publisher,
      this.description,
      this.store,
      this.steamAppID,
      this.tags,
      this.releaseDate
    ]
  }

  async create (game) {
    if (game === undefined) {
      throw Error(ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING)
    }
    if (game.title === undefined) {
      throw Error(ErrorEnum.GAME_TITLE_MISSING)
    }
    if (game.summary === undefined) {
      throw Error(ErrorEnum.GAME_SUMMARY_MISSING)
    }
    if (game.thumbnail === undefined) {
      throw Error(ErrorEnum.GAME_THUMBNAIL_MISSING)
    }
    const results = await connection.all('select.gameByTitle', game.title)
    if (results !== undefined && results.length !== 0) {
      throw Error(ErrorEnum.GAME_TITLE_IN_USE)
    }
    await connection.run('insert.game', await generateID(), game.title, game.summary, game.thumbnail, game.publisher, game.description, game.store, game.steamAppID, game.tags, game.releaseDate)
    await this.get(game.title)
    this.loaded = true
  }

  async get (title) {
    const results = await connection.all('select.gameByTitle', title)
    if (results === undefined || results.length !== 1) {
      throw Error(ErrorEnum.GAME_UNKNOWN)
    }
    Object.assign(this, results[0])
    this.loaded = true
  }

  async updateRecord () {
    if (this.loaded !== true) {
      throw Error(ErrorEnum.GAME_NOT_LOADED)
    }
    await connection.run('update.game', ...this.data, this.id)
  }
}

module.exports = Game
