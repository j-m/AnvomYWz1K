function base64 () {
  const id = btoa(Math.random()).substr(8, 8)
  return id.length === 8 ? id : base64()
}

module.exports = base64
