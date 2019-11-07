import http from 'http'
import app from './app.mjs'

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 5000

const server = http.createServer(app.callback()).listen(port, host, () => {
  console.log(`Listening on http://${host}:${port}`)
})

server.on('error', error => console.log(error))

export default server
