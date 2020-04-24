const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http) 
const cors = require('cors')

let messages = []

app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>')
})

io.on('connection', socket => {
  console.log(`User connected: ${socket.id}`)
  socket.on('disconnect', () => {
    console.log(`user disconnected: ${socket.id}`)
  })

  socket.emit('previousMessages', messages)

  socket.on('my message', message => {
    messages.push(message)
    io.emit('my broadcast', messages);
  });

  // socket.on('sendMessage', data => {
  //   messages.push(data)
  //   socket.broadcast.emit('receivedMessage', data)
  // })
})

http.listen(3333, () => {
  console.log('node running on port 3333')
})