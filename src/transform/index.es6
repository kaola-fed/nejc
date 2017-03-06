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

        let sourceDeps = map.sourceDeps || [];
        const functionBody = map.f;

        let {deps, args} = Transform.mergeArgs(
            sourceDeps,
            (map.d || []),
            Transform.getArgs(functionBody),
            this.replaceArgs);

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
        const compiler = new Compiler(functionBody, autoReturnArg, (this.mode === 1) ? depStr : null).compile(this.file)
        compiler.pipe(jsBeatify);
        return Transform.lebab(this.mode, $render((this.mode === 1) ? '' : depStr, compiler.getResult()), map, this.features);
    }

    /**
     * update Args
     * @param sourceDeps
     * @param deps
     * @param args
     * @param replaceArgs
     */
    static mergeArgs(sourceDeps, deps, args, replaceArgs = {}) {
        const replaceDepList = Object.keys(replaceArgs);

        // clone
        deps = [...deps];
        // clone
        args = [...args];

        sourceDeps.forEach((item, i) => {
            const idx = replaceDepList.indexOf(item);
            if (~idx) {
                args[i] = replaceArgs[replaceDepList[idx]];
            }
            // Remove item
            if (item === 'NULL') {
                deps[i] = null;
                args[i] = null;
            }
        });

        const deleteNull = (list) => {
            return list.filter(item => {
                return item !== null;
            })
        };

        return {
            deps: deleteNull(deps),
            args: deleteNull(args)
        }
    }

    /**
     * 输出 lebab
     * @param mode
     * @param content
     * @param map
     * @property n
     * @returns {*}
     */
    static lebab(mode, content, {n}, features) {
        if (mode === 2) {
            const result = lebab.transform(content, ['commonjs'].concat(features || []));
            if (result.warnings.length > 0) {
                console.warn(`Warning:`);
                console.warn(`${n} transform ES6 Failed`);
                console.warn(result.warnings);
            }
            return result.code;
        }
        return content
    }

    /**
     * 替换依赖别名
     * @param map
     * @property d
     * @property n
     * @param args
     * @returns {string}
     */
    getVariable({d, n}, args) {
        const deps = d;
        const parent = path.parse(n).dir;
        const importDeps = this.reduceDeps(deps, parent);
        const variable = 'var';

        const replaceImportAplias = (item, idx) => ({
            name: item,
            uri: importDeps[idx] || function () {
                return "{}";
            }
        });

        const getVariableDefine = item => {
            return `${variable} ${item.name} = ${( typeof item.uri === 'string' ) ? "require('" + item.uri + "')" : item.uri()};`;
        };

        return args.map(replaceImportAplias).map(getVariableDefine).join('\n');
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

        return [...returnDeps, _o, _o, _f, _r];
    }
}
