'use strict'

const http = require('http')

const app = require('./koa')
const connection = require('../database/connection.js')

const host = process.env.HOST
const port = process.env.PORT

let server

async function open() {
  await connection.open()
  server = http.createServer(app.callback())
  await server.listen(port, host)
}

async function close() {
  if (server) {
    server.close()
  }
}

module.exports = { open, close }
