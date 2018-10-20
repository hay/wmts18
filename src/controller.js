const Browser = require('./browser.js');
const Score = require('./score.js');

const score = new Score();

class History {
    constructor() {
        this.items = [];
    }

    push(item) {
        this.items.push(item);
    }
}

class Controller {
    constructor(io) {
        this.io = io;
        this.history = new History();
    }

    start() {
        const io = this.io;

        this.io.on('connection', (socket) => {
            const userAgent = socket.request.headers['user-agent'];
            const browser = new Browser(userAgent);
            console.log('connecting', browser.getBrowserLabel());
            this.welcome(socket);

            socket.on('startsession', () => {

                if (browser.hasClass()) {
                    console.log('startsession', browser.getBrowserLabel());
                    const browserSession = score.addBrowser(browser.getBrowserLabel());
                    browser.setSession(browserSession);
                    io.emit('score', score.getScore());
                    socket.emit('browser', browser.getSessionEmoji());
                    io.emit('login', browser.getSessionEmoji());

                    // Send history to socket
                    this.history.items.forEach((item) => {
                        socket.emit('message', item)
                    });

                    if (score.isParty()) {
                        score.setParty(true);
                        this.party(io);
                    }
                } else {
                    socket.emit('error', `
                        Sorry, your browser is not recognized. Try again with
                        a different browser.
                    `);
                }
            });

            socket.on('disconnect', () => {
                if (browser) {
                    console.log('disconnect ' + browser.getSession());
                    score.removeBrowser(browser.getBrowserLabel());
                    io.emit('score', score.getScore());
                    io.emit('logout', browser.getSessionEmoji());

                    if (score.party && !score.isParty()) {
                        console.log('KILL PARTY');
                        score.setParty(false);
                        this.killParty(io);
                    }
                } else {
                    console.log('anonymous disconnect');
                }
            });

            socket.on('message', (msg) => {
                const d = new Date();
                const h = `0${d.getHours()}`;
                const m = `0${d.getMinutes()}`;
                const time = `${h.slice(-2)}:${m.slice(-2)}`;

                const message = {
                    from : browser.getSessionEmoji(),
                    text : msg,
                    time : time,
                };

                this.history.push(message);

                socket.broadcast.emit('message', message);
            });

            socket.on('hidden', () => {
                this.isHidden(socket);
                socket.disconnect();
            });
        });
    }

    isHidden(target) {
        target.emit('modal', {
            type : 'error',
            title : 'Disconnect',
            text : `
                Sorry, but you lost focus on this tab.
                Please keep this tab focused to remain in the chatroom.
            `
        });
    }

    killParty(target) {
        target.emit('modal', {
            type : 'kill'
        });
    }

    party(target) {
        target.emit('modal', {
            type : 'youtube',
            title : 'W00000000tt!!!! 🎉🎉🎉🎉',
            youtubeId : 'bVFBgBa60cE'
       });
    }

    welcome(target) {
        target.emit('modal', {
            type : 'text',
            action : 'welcome',
            title : 'Hey!',
            text : `
                Good job! You decoded the logo (or got this link from someone else).
                For the second part of the puzzle you need to work together. 60
                different devices need to visit this page at the same time
                to unlock the final part of the puzzle. Good luck!
            `
        })
    }
}

module.exports = Controller;