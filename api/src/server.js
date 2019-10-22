const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fs = require('fs')
const routes = require('./routes')
const db = require('./config/db')
require('dotenv').config()

const app = express()

if (process.env.NODE_ENV == 'production') {
  const credentials = {
    key: fs.readFileSync(process.env.HTTPS_KEY),
    cert: fs.readFileSync(process.env.HTTPS_CERT),
  }

  const server = require('https').createServer(credentials, app)
} else {
  const server = require('http').createServer(app)
}

const io = require('socket.io')(server)

const connectedUsers = {}

io.on('connection', socket => {
  console.log('connected:', socket.id)

  const { user } = socket.handshake.query
  connectedUsers[user] = socket.id
})

app.use((req, res, next) => {
  req.io = io
  req.connectedUsers = connectedUsers

  return next()
})

app.use(cors())
app.use(express.json())
app.use(routes)

server.listen(process.env.PORT)
