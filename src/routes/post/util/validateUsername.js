const members = require('../../../models/member')

async function validateUsername (username) {
  if (username === undefined || username === '') {
    throw Error('NEW_USERNAME_MISSING')
  }
  const matches = username.match(/^[a-z0-9]+([a-z0-9-]+[a-z0-9])?$/ig)
  if (matches === null || matches.length !== 1) {
    throw Error('NEW_USERNAME_BAD_REGEX')
  }
  const records = await members.selectMember(username)
  if (records.length !== 0) {
    throw Error('NEW_USERNAME_IN_USE')
  }
}

module.exports = validateUsername
