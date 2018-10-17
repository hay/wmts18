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
}

module.exports = Browser;