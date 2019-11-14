async function logout (context, next) {
  context.session.authorised = false
  context.session.username = undefined
  context.session.privileges = 'none'
  context.body = { success: true }
}

module.exports = logout
