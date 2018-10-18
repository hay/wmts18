const Browser = require('./browser.js');
const Score = require('./score.js');

const score = new Score();

class Controller {
    constructor(io) {
        this.io = io;
    }

    start() {
        const io = this.io;

        this.io.on('connection', (socket) => {
            let browser = false;
            console.log('connect');
            this.welcome(socket);

            socket.on('startsession', () => {
                const userAgent = socket.request.headers['user-agent'];
                browser = new Browser(userAgent);

                if (browser.hasClass()) {
                    console.log('startsession', browser.getBrowserLabel());
                    const browserSession = score.addBrowser(browser.getBrowserLabel());
                    browser.setSession(browserSession);
                    io.emit('score', score.getScore());
                    socket.emit('browser', browser.getSession());
                    io.emit('login', browser.getSession());

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
                    io.emit('logout', browser.getSession());

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

                socket.broadcast.emit('message', {
                    from : browser.getSession(),
                    text : msg,
                    time : time,
                });
            });
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