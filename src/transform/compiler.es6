import HasReturnStatement from '../analysis/hasReturnStatement';

class Compiler {
    constructor(input, ap, args) {
        this.ap = ap;
        this.result = input;
        this.args = args;
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
            'function EXP (' + this.args.join(',') + ') {');
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

        const file = this.file.replace(/\\/g,'//');
        if (!this.args) {
            if (~file.indexOf('base/element.js')
                || ~file.indexOf('base/event.js')) {
                this.result = this.result + '\n\nmodule.exports.__proto__ = EXP.call(window)\n';
            } else {
                this.result = this.result + '\n\nmodule.exports = EXP.call(window)\n';
            }
        } else {
            this.result = this.result + '\n\nmodule.exports = EXP.call(window,' + this.args.join(',') + ')\n';
        }
        return this;
    }
}

module.exports = Compiler;
