const sqlite = require('sqlite-async')

let database

async function open () {
  database = await sqlite.open(process.env.DATABASE || './database.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE)
}

async function createTable () {
  await database.run('CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY AUTOINCREMENT)')
}

async function addRowToTable () {
  await database.run('INSERT INTO test (id) VALUES (NULL)')
}

async function getTableRows () {
  const result = await database.all('SELECT id FROM test')
  return result
}

async function close () {
  if (database !== undefined) {
    await database.close()
  }
}

module.exports = { open, createTable, addRowToTable, getTableRows, close }
