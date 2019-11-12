async function logout (context, next) {
  context.session.authorised = false
  context.session.username = undefined
  return context.body({ success: true })
}

module.exports = logout
