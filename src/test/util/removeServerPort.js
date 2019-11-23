'use strict'

function removeServerPort(body) {
  const regex = /(127\.0\.0\.1\:)[0-9]{5}/g
  return body.replace(regex, 'baseURL')
}

module.exports = removeServerPort
