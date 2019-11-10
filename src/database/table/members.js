const connection = require('../connection.js')

async function insertMember (email, username, password) {
  return connection.run('insert.member', email, username, password)
}

async function selectAll () {
  return connection.all('select.allMembers')
}

module.exports = { insertMember, selectAll }
