const connection = require('../connection.js')

async function insertMember (email, username, password) {
  return connection.run('insert.member', email, username, password)
}

async function selectAll () {
  return connection.all('select.allMembers')
}

async function selectMember (username) {
  if (username === undefined) {
    throw Error('members.selectMember requires a username')
  }
  return connection.all('select.member', username)
}

module.exports = { insertMember, selectAll, selectMember }
