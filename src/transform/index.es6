import path from 'path';
import {readFileSync} from 'fs';
import compile from './compiler';
import lebab from 'lebab';
import {isInLibs, render, jsBeatify} from '../tookit/tookit';


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

        map.d = map.d || [];

        const sourceDeps = map.sourceDeps || [];
        const functionBody = map.f;

        let {deps, args} = Transform.mergeArgs(
            sourceDeps,
            map.d,
            Transform.getArgs(functionBody),
            this.replaceArgs);

        const autoReturnArg = args[deps.length];
        const depStr = this.getVariable({
            d: deps,
            n: map.n
        }, args);
        /**
         * @mode 1 -- es5
         * function EXP() {
         *  var a = require('./a');
         *  var b = require('./b');
         *  return a + b;
         * }
         * module.export = EXP.apply(window);
         *
         * @mode 2 -- es6
         * import a from './a';
         * import b from './b';
         * function EXP() {
         *  var a = require('./a');
         *  var b = require('./b');
         *  return a + b;
         * }
         * export default EXP.apply(window);
         */
        const pipeline = compile({
            input: functionBody,
            ap: autoReturnArg,
            depStr: (this.mode === 1) ? depStr : null,
            file: this.file
        });

        (this.plugins || []).forEach(plugin => pipeline.pipe);

        // lebab 转换
        pipeline.pipe(({type, text}) => {
            return {
                type,
                text: Transform.lebab(this.mode,
                    render(
                        (this.mode === 1) ? '' : depStr,
                        text
                    ), map, this.features)
            }
        });

        // 最终, 格式化
        pipeline.pipe(({text}) => {
            return jsBeatify(text);
        });

        return pipeline.getResult();
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
        const depSize = deps.length;
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
        const argsMatchedDeps = args.map(replaceImportAplias).map(getVariableDefine);

        // 传参数量比依赖多 -> 注入 p p f r
        if (args.length >= depSize) {
            return argsMatchedDeps.join('\n');
        }

        // 需要 require
        return [...argsMatchedDeps, ...importDeps.slice(argsMatchedDeps.length, depSize).map(item => {
            return `require("${item}");`
        })].join('\n');
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
        const _libs = (this.libs || []);

        const hackWindowsPath = (absPath) => {
            return absPath.replace(/\\+/g, '/')
                .split('/')
                .filter(item => !!item)
                .join('/');
        };

        const returnDeps = deps.map(item => {
            // libs内的不处理
            if (isInLibs(_libs, item)) {
                return item;
            }
            const p = path
                .relative(parent, item)
                .replace(/\.js$/g, '');

            // 相对路径
            if (!p.startsWith('..')) {
                return p.startsWith('.') ? p : './' + p;
            } else {
                let {key, value} = this.alias.filter(alias => {
                    return !!(~item.indexOf(alias.value));
                })[0] || {};
                if (key && value) {
                    return item.replace(value, key)
                }
            }

            return p;
        }).map(hackWindowsPath);


        return [...returnDeps, _o, _o, _f, _r];
    }
}
