'use strict'

const sqlite = require('sqlite-async')

const queries = require('./queries')
const ErrorEnum = require('../util/ErrorEnum')

let database

async function open() {
  await Promise.all([
    sqlite.open(process.env.DATABASE).then(db => {
      database = db
    }),
    queries.load()
  ])
  await createTables()
}

async function createTables() {
  const games = run('create.games')
  const flags = run('create.flags')
  const members = run('create.members')

  const reviews = Promise.all([members, games]).then(run('create.reviews'))

  const comments = Promise.all([members, reviews]).then(run('create.comments'))
  const assessments = Promise.all([members, flags]).then(run('create.assessments'))

  await Promise.all([games, flags, members, reviews, comments, assessments])
}

async function close() {
  if (database !== undefined) {
    await database.close()
  }
  queries.close()
}

async function run(file, ...values) {
  const query = queries.get(file)
  if (values.length !== query.split('?').length - 1) {
    throw Error(ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING)
  }
  return database.run(query, values).catch(error => {
    throw Error(`Error running '${file}' with values '${values}'. ${error}`)
  })
}

async function all(file, ...values) {
  const query = queries.get(file)
  if (values.length !== query.split('?').length - 1) {
    throw Error(ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING)
  }
  return database.all(query, values)
}

module.exports = { run, all, open, close }
