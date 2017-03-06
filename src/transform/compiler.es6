import HasReturnStatement from '../analysis/hasReturnStatement';
import Pipeable from '../tookit/Pipeable';

class Compiler {
    constructor(input, ap, depStr) {
        this.ap = ap;
        this.result = input;
        this.depStr = depStr;
    }

    compile(file) {
        this.file = file;
        const pipeable = new Pipeable(this.result);

        pipeable.pipe(
            this.reduceWrapFunction.bind(this)
        ).pipe(
            this.reduceReturnStatement.bind(this)
        );
        return pipeable;
    }

    reduceWrapFunction(result) {
        return result.replace(
            /^\s*function\s*\([^)]*\)\s*\{/, [
                '/** NejC Transform Module Wrapper **/ function module_exports () {',
                /**
                 * Hack ES5 Inner Function Dependency
                 */
                this.depStr || ''
            ].join('\n'));
    }

    reduceReturnStatement(result) {
        if (this.ap) {
            const hasReturnStatement = new HasReturnStatement(result).compile();
            if (!hasReturnStatement) {
                result = result.replace(/\}\s*$/g, '\t return ' + this.ap + '; \n}');
            } else {

            }
        }

        /**
         * Hack Windows Sep
         * @type {*}
         */
        const file = this.file.replace(/\\/g, '//');

        /**
         * Hack NEJ Circle Dependencies
         * @type {*}
         */
        if (~file.indexOf('base/element.js')
            || ~file.indexOf('base/event.js')) {
            result = result + '\n\nmodule.exports.__proto__ = module_exports.call(window);\n';
        } else {
            result = result + '\n\nmodule.exports = module_exports.call(window);\n';
        }
        return result;
    }
}

export default Compiler;
