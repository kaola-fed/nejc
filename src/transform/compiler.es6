import HasReturnStatement from '../analysis/hasReturnStatement';

class Compiler {
    constructor(input, ap, depStr) {
        this.ap = ap;
        this.result = input;
        this.depStr = depStr;
    }

    compile(file) {
        this.file = file;
        this
            .reduceWrapFunction()
            .reduceReturnStatement();

        return this.result;
    }

    reduceWrapFunction() {
        this.result = this.result.replace(
            /^\s*function\s*\([^)]*\)\s*\{/,
            'function EXP () {' + (this.depStr || ''));
        return this;
    }

    reduceReturnStatement() {
        if (this.ap) {
            const hasReturnStatement = new HasReturnStatement(this.result).compile();
            if (!hasReturnStatement) {
                this.result = this.result.replace(/\}\s*$/g, '\t return ' + this.ap + '; \n}');
            } else {

            }
        }
        this.result = this.result + '\n\nmodule.exports = EXP.call(window)\n';
        return this;
    }
}

module.exports = Compiler;
