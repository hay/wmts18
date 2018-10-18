const { every, fromPairs } = require('lodash');
const CLASSES = require('../test/classes.js');

function parseClass(cls) {
    return {
        label : cls.label,
        count : cls.count,
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

            return `${browser} ${this.score[browser].sessions}`;
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
            this.score[browser].sessions -= 1;
        }
    }

    setParty(bool) {
        this.party = bool;
    }
}

module.exports = Score;