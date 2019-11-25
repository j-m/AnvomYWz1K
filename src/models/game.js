'use strict'

const connection = require('../database/connection')
const ErrorEnum = require('../util/ErrorEnum')
const random = require('../util/random')

async function generateID() {
  let results
  let id
  while (results === undefined || results.length !== 0) {
    id = random.base64String()
    results = await connection.all('select.gameByID', id)
  }
  return id
}

function hasRequiredProperties(game) {
  if (game === undefined) {
    throw Error(ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING)
  }
  if (game.steamAppID === undefined) {
    throw Error(ErrorEnum.GAME_STEAM_APP_ID_MISSING)
  }
  if (game.title === undefined) {
    throw Error(ErrorEnum.GAME_TITLE_MISSING)
  }
  if (game.summary === undefined) {
    throw Error(ErrorEnum.GAME_SUMMARY_MISSING)
  }
}

function isExpectedProperty(key) {
  const expectedKeys = [
    'steamAppID',
    'title',
    'summary',
    'developer',
    'publisher',
    'description',
    'category',
    'releaseDate',
    'store',
    'thumbnail',
    'banner'
  ]
  if (expectedKeys.includes(key) === false) {
    throw Error(ErrorEnum.GAME_UNEXPECTED_KEY)
  }
}

function onlyHasExpectedProperties(game) {
  const keys = Object.keys(game)
  for (const key of keys) {
    isExpectedProperty(key)
  }
}

class Game {
  get data() {
    return [
      this.steamAppID,
      this.title,
      this.summary,
      this.developer,
      this.publisher,
      this.description,
      this.category,
      this.releaseDate,
      this.store,
      this.thumbnail,
      this.banner
    ]
  }

  async create(game) {
    hasRequiredProperties(game)
    onlyHasExpectedProperties(game)
    const results = await connection.all('select.gameByTitle', game.title)
    if (results !== undefined && results.length !== 0) {
      throw Error(ErrorEnum.GAME_TITLE_IN_USE)
    }
    Object.assign(this, game)
    await connection.run('insert.game', await generateID(), ...this.data)
    this.loaded = true
  }

  async get(title) {
    const results = await connection.all('select.gameByTitle', title)
    if (results === undefined || results.length !== 1) {
      throw Error(ErrorEnum.GAME_UNKNOWN)
    }
    Object.assign(this, results[0])
    this.loaded = true
  }

  update(game) {
    hasRequiredProperties(game)
    onlyHasExpectedProperties(game)
    Object.assign(this, game)
    this.updateRecord()
  }

  async updateRecord() {
    if (this.loaded !== true) {
      throw Error(ErrorEnum.GAME_NOT_LOADED)
    }
    await connection.run('update.game', ...this.data, this.id)
  }
}

module.exports = Game
