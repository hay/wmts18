const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const static = express.static('static');
app.use(static);
const server = http.Server(app);
const io = socketio.listen(server);
const PORT = 3000;

io.on('connection', (socket) => {
    console.log('connected');
});

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});