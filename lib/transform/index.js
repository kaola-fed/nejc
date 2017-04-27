const path =require( 'path');
const {readFileSync} =require( 'fs');
const compile =require( './compiler');
const lebab =require( 'lebab');
const {isInLibs, render, jsBeatify} =require( '../tookit/tookit');


module.exports = class Transform {
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
        map.patchList = map.patchList || [];
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
            n: map.n,
            p: map.patchList
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

        (this.plugins || []).forEach(plugin => {
            pipeline.pipe(text => plugin({
                text,
                deps: map.d
            }))
        });

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
            return list.filter(item => (item !== null))
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
    getVariable({d, n, p}, args) {
        let deps = d;

        const parent = path.parse(n).dir;
        const patchList = p;
        const depSize = deps.length;

        if (this.isPatch) {
            deps = deps.concat(patchList);
            // args = args.slice(0, depSize).concat(patchList.map(item => 'NULL').concat(args.slice(depSize)));
            args = args.slice(0, depSize)
                    .concat(patchList.map(item => 'PLATFORM')
                    .concat(args.slice(depSize)));
        }

        let importDeps = this.reduceDeps(deps, parent);

        const variable = 'var';

        const replaceImportAplias = (item, idx) => ({
            name: item,
            uri: importDeps[idx] || function () {
                return "{}";
            }
        });

        const getVariableDefine = item => {
            const requestStatement = `${( typeof item.uri === 'string' ) ? "require('" + item.uri + "')" : item.uri()};`;

            if (item.name === 'PLATFORM') {
                return `if (WITHPATCH) {
                    ${requestStatement}
                };`;
            }
            
            return `${variable} ${item.name} = ${requestStatement};`;
        };
        const argsMatchedDeps = args.map(replaceImportAplias).map(getVariableDefine);

        // 传参数量比依赖多 -> 注入 p p f r
        if (args.length >= depSize) {
            return argsMatchedDeps.join('\n');
        }

        const appendDeps = importDeps.slice(argsMatchedDeps.length, depSize).map(item => `require("${item}");`);
        // 需要 require
        return [
            ...argsMatchedDeps,
            ...appendDeps,
            '\n'
        ].join('\n');
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
        return [...this.convertDepsUri(deps, parent), _o, _o, _f, _r];
    }

    convertDepsUri(deps, parent) {
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
                return './' + p;
            } else {
                let {key, value} = this.alias.filter(alias => {
                    return !!(~item.indexOf(alias.value));
                })[0] || {};
                if (key && value) {
                    const returnValue = item.replace(value.replace(/[\\/]*$/g, ''), key);
                    return returnValue
                }
            }

            return p;
        }).map(hackWindowsPath);

        return returnDeps;
    }
}
