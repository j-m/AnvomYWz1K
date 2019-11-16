'use strict'

const http = require('http')
const app = require('./koa')

const host = process.env.HOST
const port = process.env.PORT

let server

function open() {
  server = http.createServer(app.callback())
  server.listen(port, host, () => {
    console.log(`Listening on http://${host}:${port}`)
  }).on('error', error => console.log(error))
}

function close() {
  if (server !== undefined) {
    server.close()
  }
}

module.exports = { open, close }
