const bowser = require('bowser');
const CLASSES = require('./classes.js');

class Browser {
    constructor(userAgent) {
        this.userAgent = userAgent;
        this.browser = bowser.getParser(this.userAgent);
        this.browserName = this.browser.parsedResult.browser.name;
        this.platform = this.browser.parsedResult.platform.type;
        this.os = this.browser.parsedResult.os.name;
        this.class = this.getClass();
        this.session = null;
    }

    getBrowserLabel() {
        return this.class ? this.class.label : 'Unknown browser';
    }

    getClass() {
        for (const cls of CLASSES) {
            if (cls.platform && cls.platform !== this.platform) continue;
            if (cls.browser && cls.browser !== this.browserName) continue;
            if (cls.os && cls.os !== this.os) continue;
            return cls;
        }

        return null;
    }

    getSession() {
        return `${this.getBrowserLabel()} ${this.session}`;
    }

    getSessionEmoji() {
        return `${this.class.emoji}${this.session}`;
    }

    hasClass() {
        return !!this.class;
    }

    setSession(session) {
        this.session = session;
    }
}

module.exports = Browser;