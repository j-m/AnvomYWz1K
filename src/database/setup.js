const database = require('../connection.js').database
const sql = require('../queries.js').sql

async function setup () {
  const promises = []
  for (const query of sql.create) {
    promises.push(database.run(query))
  }
  await Promise.all(promises)
}

module.exports = setup
