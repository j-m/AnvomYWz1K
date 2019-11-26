'use strict'

process.env.DATABASE = process.env.DATABASE || './src/database/database.db'
process.env.HOST = process.env.HOST || process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'
process.env.PORT = process.env.PORT || '5000'
process.env.SALT_ROUNDS = process.env.SALT_ROUNDS || '12'
process.env.MINIMUM_PASSWORD_LENGTH = process.env.MINIMUM_PASSWORD_LENGTH || '10'
process.env.REVIEWS_PER_PAGE = process.env.REVIEWS_PER_PAGE || '1'

const server = require('./app/server.js')

server.open()

process.on('SIGINT', () => {
  server.close()
})
