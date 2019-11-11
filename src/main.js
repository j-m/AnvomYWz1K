process.env.DATABASE = process.env.DATABASE || './src/database/database.db'
process.env.HOST = process.env.HOST || 'localhost'
process.env.PORT = process.env.PORT || 5000

const database = require('./database/connection.js')
const server = require('./app/server.js')

database.open()
server.open()

process.on('SIGINT', () => {
  database.close()
  server.close()
})
