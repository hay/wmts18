export default function(socket) {
    socket.on('login', (msg) => {
        this.messages.push({
            source : 'user',
            text : `${msg} has logged in`
        });
    });

    socket.on('logout', (msg) => {
        this.messages.push({
            source : 'user',
            text : `${msg} has logged out`
        });
    });

    socket.on('error', (err) => {
        this.modal = {
            type : 'error',
            title : 'Error',
            text : err
        };
        this.showModal = true;
    });

    socket.on('message', (msg) => {
        this.messages.push({
            from : msg.from,
            source : 'server',
            time : msg.time,
            text : msg.text
        });

        this.scrollChat();
    });

    socket.on('modal', (modal) => {
        this.modal = modal;
        this.showModal = modal.type !== 'kill';
    });

    socket.on('score', (score) => this.score = score);

    socket.on('browser', (browser) => {
        console.log(`You are: ${browser}`);
    });

    socket.on('debug', (msg) => { console.log(msg) } );
}