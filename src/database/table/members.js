const connection = require('../connection.js')

async function insertMember (email, username, password) {
  return connection.run('insert.member', email, username, password)
}

async function selectAll () {
  return connection.all('select.allMembers')
}

async function selectMember (username) {
  return connection.all('select.memberByUsername', username)
}

module.exports = { insertMember, selectAll, selectMember }
