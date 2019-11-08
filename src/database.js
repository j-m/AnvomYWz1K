import sqlite from 'sqlite-async'

let database

async function open () {
  database = await sqlite.open(process.env.DATABASE || 'database.db', sqlite.OPEN_CREATE)
}

async function createTable () {
  database.run('CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY AUTOINCREMENT)')
}

async function addRowToTable () {
  database.run('INSERT INTO test')
}

async function getTableRows () {
  const result = await database.run('SELECT * FROM test')
  return result
}

function close () {
  database.close()
}

export { open, createTable, addRowToTable, getTableRows, close }
