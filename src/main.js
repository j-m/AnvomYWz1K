process.env.DATABASE = process.env.DATABASE || './database.db'
process.env.HOST = process.env.HOST || 'localhost'
process.env.PORT = process.env.PORT || 5000

const database = require('./database.js')
const server = require('./server.js')

database.open()

process.on('SIGINT', () => {
  database.close()
  server.close()
})
