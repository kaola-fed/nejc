import HasReturnStatement from './hasReturnStatement';

class Compiler {
    constructor(input, ap) {
        this.ap = ap;
        this.result = input;
    }

    compile() {
        this
            .reduceWrapFunction()
            .reduceReturnStatement();

        return this.result;
    }

    reduceWrapFunction() {
        this.result = this.result.replace(/^\s*function\s*\([^)]*\)\s*\{/, 'function moduleExports () {');
        return this;
    }

    reduceReturnStatement() {
        const hasReturnStatement = new HasReturnStatement(this.result).compile();

        if (this.ap && !hasReturnStatement) {
            this.result = this.result.replace(/\}\s*$/g, '\t return ' + this.ap + '; \n}');
        }

        this.result = this.result + '\n\nmodule.exports = moduleExports.call(window)\n';

        return this;
    }
}

module.exports = Compiler;
