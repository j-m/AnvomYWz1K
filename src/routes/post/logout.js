async function logout (context, next) {
  context.session.authorised = false
  context.session.username = undefined
  context.body = { success: true }
}

module.exports = logout
