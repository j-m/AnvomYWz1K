const database = require('./database.js')
const server = require('./app.js')

process.env.DATABASE = process.env.DATABASE || './database.db'
process.env.HOST = process.env.HOST || 'localhost'
process.env.PORT = process.env.PORT || 5000

database.open()
server.open()

process.on('SIGINT', () => {
  database.close()
  server.close()
})
