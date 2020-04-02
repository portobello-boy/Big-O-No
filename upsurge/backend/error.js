class Err {
    constructor(val) {
        this.val = val;
    }

    interpret() {
        let errFile = require('./errList');
        console.log(errFile);
    }
}

module.exports = { Err }