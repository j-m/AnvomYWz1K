const connection = require('../database/connection')
const ErrorEnum = require('../util/ErrorEnum')
const base64 = require('../util/base64')

class Game {
  async generateID () {
    let results
    let id
    while (results === undefined || results.length !== 0) {
      id = base64()
      results = await connection.all('select.gameByID', id)
    }
    return id
  }

  async create (title, summary, publisher) {
    await connection.run('insert.game', this.generateID(), title, summary, publisher)
    await this.get(title)
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
    await connection.run('update.game', this.id, this.title, this.summary, this.publisher, this.description, this.store, this.tags, this.released)
  }
}

module.exports = Game
