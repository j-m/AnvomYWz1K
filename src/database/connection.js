const sqlite = require('sqlite-async')
const queries = require('./queries.js')
const setup = require('./setup.js')

let database

async function open () {
  await Promise.all([
    database = sqlite.open(process.env.DATABASE),
    queries.load()
  ])
  console.log(database)
  await setup()
}

async function close () {
  if (database !== undefined) {
    await database.close()
  }
  queries.close()
}

module.exports = { database, open, close }
