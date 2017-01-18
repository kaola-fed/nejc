import path from 'path';
import {readFileSync} from 'fs';
import {js_beautify} from 'js-beautify';
import Compiler from './compiler';
import ejs from 'ejs';
const jsBeatify = str => js_beautify(str, {indent_size: 4});
const template = `
<%- depStr %>

<%- fn %>;`;

export default class Transform {
    constructor(opt) {
        Object.assign(this, opt);
    }

    transform(map) {
        if (!map) {
            return '';
        }

        const deps = map.d || [];
        const functionBody = map.f;
        const args = Transform.getArgs(functionBody);
        const autoReturnArg = args[deps.length];

        const parent = path.parse(map.n).dir;

        const importDeps = this.reduceDeps(deps, parent);

        const depMap = args.map((item, idx) => {
            return {
                name: item,
                uri: importDeps[idx] || function () {
                    return "{}"
                }
            }
        });

        const variable = this.syntax === 'es6' ? 'let' : 'var';
        const depStr = depMap.map(item => {
            return `${variable} ${item.name} = ${( typeof item.uri === 'string' ) ? "require('"+ item.uri +"')": item.uri()};`;
        }).join('\n');


        if (this.mode === 1) {
            const body = jsBeatify(new Compiler(functionBody, autoReturnArg).compile(this.file));
            return ejs.render(template, {
                fn: body,
                depStr
            });
        } else if (this.mode === 2) {
            const body = jsBeatify(new Compiler(functionBody, autoReturnArg, args).compile(this.file));
            return ejs.render(template, {
                fn: body,
                depStr,
            });
        }
    }

    static getArgs(fn) {
        const argStr = ((fn.match(/^.*?\s*[^\(]*\(\s*([^\)]*)\)/m) || [])[1]) || null;

        return argStr ? argStr.split(',').map((item) => {
            return item.replace(/\s*/g, '')
        }) : [];
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
                .replace(/\.js$/ig,'')
                .replace(/\\/ig,'/');

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
