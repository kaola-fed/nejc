import HasReturnStatement from './hasReturnStatement';

class Compiler {
    constructor(input, ap) {
        this.input = input;
        this.ap = ap;
        this.updateFunctionWrapper();
    }

    updateFunctionWrapper() {
        this.result =
            this.input
                .replace(/^\s*function\s*\([^)]*\)\s*\{/, 'function moduleExports () {');

        const hasReturnStatement =  new HasReturnStatement(this.result).compile();

        if (this.ap && !hasReturnStatement) {
            this.result = this.result.replace(/\}\s*$/g, '\t return ' + this.ap + '; \n}');
        }

        this.result = this.result + '\n\nmodule.exports = moduleExports()\n';
    }

    compile() {
        return this.result;
    }
}

module.exports = Compiler;
