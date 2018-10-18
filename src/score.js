const { every, fromPairs } = require('lodash');
const CLASSES = require('../test/classes.js');

function parseClass(cls) {
    return {
        count : cls.count,
        emoji : cls.emoji,
        label : cls.label,
        sessions : 0
    };
}

class Score {
    constructor() {
        this.score = fromPairs(CLASSES.map(parseClass).map(cls => [cls.label, cls]));
        this.party = false;
    }

    addBrowser(browser) {
        if (browser in this.score) {
            this.score[browser].sessions += 1;

            return this.score[browser].sessions;
        } else {
            return `undefined browser`;
        }
    }

    getScore() {
        return this.score;
    }

    isParty() {
        const scores = Object.values(this.score).map((score) => {
            return score.sessions >= score.count;
        });

        return every(scores);
    }

    removeBrowser(browser) {
        if (browser in this.score) {
            const sess = this.score[browser];
            sess.sessions -= 1;

            if (sess.sessions < 0) {
                sess.sessions = 0;
            }
        }
    }

    setParty(bool) {
        this.party = bool;
    }
}

module.exports = Score;