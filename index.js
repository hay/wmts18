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
    io.emit('message', 'Hey!');

    socket.on('disconnect', () => {
        console.log('disconnection');
    });

    socket.on('message', (msg) => {
        console.log(`Got a message: {msg}`);

        setTimeout(() => {
            io.emit('message', msg.toUpperCase());
        }, 500);
    });
});

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});