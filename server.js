const socketio = require('socket.io');
const Controller = require('./src/controller.js');

module.exports = {
    onReady(server) {
        const io = socketio.listen(server, {
            path : '/node/wmts18/socket.io'
        });

        const controller = new Controller(io);
        controller.start();
    },

    static : `${__dirname}/static`
};