'use strict'

function authorisation(context, parameters) {
  parameters.username = context.session.username
  if (context.session.privileges === 'administrator') {
    parameters.administrator = true
    parameters.moderator = true
  }
  if (context.session.privileges === 'moderator') {
    parameters.moderator = true
  }
  return parameters
}

module.exports = authorisation
