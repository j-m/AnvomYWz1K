'use strict'

const removeServerPort = require('./removeServerPort')
const removeTimeTags = require('./removeTimeTags')

function scrubSnapshot(body) {
  body = removeServerPort(body)
  body = removeTimeTags(body)
  return body
}

module.exports = scrubSnapshot
