const sqlite = require('sqlite-async')
const queries = require('./queries.js')
let database

async function open () {
  database = await sqlite.open(process.env.DATABASE, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE)
  await queries.load()
}

async function close () {
  if (database !== undefined) {
    await database.close()
  }
  queries.close()
}

module.exports = { database, open, close }
