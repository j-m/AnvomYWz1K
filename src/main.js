import database from './database.mjs'
import server from './app.mjs'

database.open()
server.open()

process.on('SIGINT', () => {
  database.close()
  server.close()
})
