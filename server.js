const http = require('http')
const Server = require('./src')
const PORT = process.env.PORT ?? 5050

const server = http.createServer(Server)

server.listen(PORT, () => console.log(`Server running at ${PORT}...`))
