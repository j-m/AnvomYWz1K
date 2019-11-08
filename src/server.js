const http = require('http')
const app = require('./app.js')

const host = process.env.HOST
const port = process.env.PORT

const server = http.createServer(app.callback()).listen(port, host, () => {
  console.log(`Listening on http://${host}:${port}`)
}).on('error', error => console.log(error))

module.exports = server
