const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const Browser = require('./src/browser.js');

const app = express();
const static = express.static('static');
app.use(static);
const server = http.Server(app);
const io = socketio.listen(server);
const PORT = 3000;

io.on('connection', (socket) => {
    const userAgent = socket.request.headers['user-agent'];
    const browser = new Browser(userAgent);
    io.emit('login', browser.class.label);

    io.emit('debug', userAgent);
    io.emit('message', 'Hey!');

    socket.on('disconnect', () => {
        io.emit('logout', browser.class.label);
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