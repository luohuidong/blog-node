const http = require('http')
const serverHandle = require('../app')

const hostname = '127.0.0.1'
const port = 8000

const server = http.createServer(serverHandle)

server.listen(port, hostname, () => {
  /* eslint-disable*/
  console.log(`Server running at http://${hostname}:${port}/`)
  /* eslint-enable*/
})
