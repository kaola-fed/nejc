import path from 'path';
import {readFileSync} from 'fs';
import {js_beautify} from 'js-beautify';
import Compiler from './compiler';
import lebab from 'lebab';
const jsBeatify = str => js_beautify(str, {indent_size: 4});

const $render = function (depStr, fn) {
    return `${depStr}

${fn}`;
};

export default class Transform {
    constructor(opt) {
        Object.assign(this, opt);
    }

    /**
     * 接受依赖关系，重新输出 ES5 | ES6 的代码
     * @param map 依赖关系
     * @returns {*}
     */
    transform(map) {
        if (!map) {
            return '';
        }

        const deps = map.d || [];
        const functionBody = map.f;
        const args = Transform.getArgs(functionBody);
        const autoReturnArg = args[deps.length];
        const depStr = this.getVariable(map, args);
        /**
         * @mode 1 -- es5
         * function EXP() {
         *  var a = require('./a');
         *  var b = require('./b');
         *  return a + b;
         * }
         * module.export = EXP.call(window);
         *
         * @mode 2 -- es6
         * import a from './a';
         * import b from './b';
         * function EXP() {
         *  var a = require('./a');
         *  var b = require('./b');
         *  return a + b;
         * }
         * export default EXP.call(window);
         */
        const body = jsBeatify(new Compiler(functionBody, autoReturnArg, (this.mode === 1)? depStr : null).compile(this.file));
        return Transform.lebab(this.mode, $render((this.mode === 1)? '' : depStr, body));
    }

    static lebab(mode, content) {
        if (mode === 2) {
            const result = lebab.transform(content, ['commonjs', /**'obj-shorthand', 'template', 'default-param', 'includes'**/]);
            if (result.warnings.length > 0) {
                console.log(result.warnings);
            }
            return result.code;
        }
        return content
    }

    getVariable({d, n}, args){
        const deps = d;
        const parent = path.parse(n).dir;
        const importDeps = this.reduceDeps(deps, parent);
        const depMap = args.map((item, idx) => {
            return {
                name: item,
                uri: importDeps[idx] || function () {
                    return "{}";
                }
            }
        });
        const variable = 'var';

        return depMap.map(item => {
            return `${variable} ${item.name} = ${( typeof item.uri === 'string' ) ? "require('" + item.uri + "')" : item.uri()};`;
        }).join('\n');
    }

    /**
     * Function String -> Args Array
     * @param fn function
     * @returns {Array} 传参数组
     */
    static getArgs(fn) {
        const argStr = ((fn.match(/^.*?\s*[^\(]*\(\s*([^\)]*)\)/m) || [])[1]) || null;
        if (argStr) {
            return argStr.split(',').map(item => {
                return item.replace(/\s*/g, '')
            });
        }
        return [];
    }

    /**
     * @param deps
     * @param parent
     * @returns {Array|*}
     */
    reduceDeps(deps, parent) {
        const _o = function () {
                return '{}'
            },
            _r = function () {
                return '[]'
            },
            _f = function () {
                return 'function(){return !1;}'
            };

        const returnDeps = deps.map((item) => {
            const p = path
                .relative(parent, item)
                .replace(/\.js$/ig, '')
                .replace(/\\/ig, '/');

            if (!p.startsWith('..')) {
                return p.startsWith('.') ? p : './' + p;
            }
            let alias = this.alias.filter(alias => {
                return !!(~item.indexOf(alias.value));
            })[0];

            if (alias && alias.key) {
                return item
                    .replace(alias.value, alias.key.replace(/\/$/, '') + '/')
                    .replace(/^\//g, '');
            }
            return p;
        });

        returnDeps.push(_o, _o, _f, _r);

        return returnDeps;
    }
}
