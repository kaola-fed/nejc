class Pipeable {
    constructor(source) {
        this.result = source;
    }
    pipe (fn) {
        this.result = fn(this.result);
        return this;
    }
    getResult() {
        return this.result;
    }
}
module.exports = Pipeable;