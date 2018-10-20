const socketio = require('socket.io');
const Controller = require('./src/controller.js');

module.exports = {
    onReady({ server, root }) {
        const io = socketio.listen(server, {
            path : `${root}/socket.io`
        });

        const controller = new Controller(io);
        controller.start();
    },

    static : `${__dirname}/static`
};