const CLASSES = require('../src/classes.js');
const score = ['iPhone phone', 'Desktop Chrome', 'Desktop Firefox'];

module.exports = CLASSES.map((cls) => {
    if (score.includes(cls.label)) {
        cls.count = 1;
    } else {
        cls.count = 0;
    }

    return cls;
});