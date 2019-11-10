const database = require('../connection.js').database
const sql = require('../queries.js').sql

async function insertMember () {
  return database.run(sql.insert.member)
}

async function selectAll () {
  return database.all(sql.select.allMembers)
}

module.exports = { insertMember, selectAll }
