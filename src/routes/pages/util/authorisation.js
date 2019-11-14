function authorisation (context, parameters) {
  parameters.username = context.session.username
  parameters.administrator = false
  parameters.moderator = false
  if (context.session.privileges === 'administrator') {
    parameters.administrator = true
    parameters.moderator = true
  }
  if (context.session.privileges === 'moderator') {
    parameters.administrator = false
    parameters.moderator = true
  }
  return parameters
}

module.exports = authorisation
