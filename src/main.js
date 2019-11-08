const database = require('./database.js')
const server = require('./app.js')

database.open()
server.open()

process.on('SIGINT', () => {
  database.close()
  server.close()
})
