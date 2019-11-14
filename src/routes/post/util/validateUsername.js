const members = require('../../../models/member')
const ErrorEnum = require('../../../util/ErrorEnum')

async function validateUsername (username) {
  if (username === undefined || username === '') {
    throw Error(ErrorEnum.USERNAME_MISSING)
  }
  const matches = username.match(/^[a-z0-9]+([a-z0-9-]+[a-z0-9])?$/ig)
  if (matches === null || matches.length !== 1) {
    throw Error(ErrorEnum.USERNAME_BAD_REGEX)
  }
  const records = await members.selectMember(username)
  if (records.length !== 0) {
    throw Error(ErrorEnum.USERNAME_IN_USE)
  }
}

module.exports = validateUsername
