import path from 'path';
import {js_beautify} from 'js-beautify';
import Compiler from './compiler';
import ejs from 'ejs';
const jsBeatify = str => js_beautify(str, {indent_size: 4});
const template = `<%depMap.forEach(function(item){%>let <%- item.name %> = <% if( typeof item.uri === 'string'){ %>require('<%- item.uri  %>')<%}else {%><%= item.uri() %><%}%>;
<%})%>
<%- fn %>;`;

export default class Transform {
    constructor(opt) {

        Object.assign(this, opt);

    }

    transform(map) {
        if (!map) {
            return '';
        }

        let deps = map.d || [],
            fn = map.f,
            nowFile = map.n,
            parent = path.parse(nowFile).dir;

        const args = Transform.getArgs(fn);
        const _ap = args[deps.length];

        fn = jsBeatify(new Compiler(fn, _ap).compile());

        deps = this.handleDeps(deps, parent);

        const depMap = args.map((item, idx) => {
            return {
                name: item,
                uri: deps[idx] || function () {
                    return "{}"
                }
            }
        });

        return ejs.render(template, {
            depMap, fn
        });
    }

    static getArgs(fn) {
        const argStr = ((fn.match(/^.*?\s*[^\(]*\(\s*([^\)]*)\)/m) || [])[1]) || null;

        return argStr ? argStr.split(',').map((item) => {
            return item.replace(/\s*/g, '')
        }) : [];
    }

    handleDeps(deps, parent) {

        const _deps = deps.map((item) => {
            const p = path.relative(parent, item);
            if (!p.startsWith('..')) {
                return p.startsWith('.') ? p : './' + p;
            }
            let alias = this.alias.filter(alias => {
                return !!(~item.indexOf(alias.value));
            })[0];

            if (alias && alias.key) {
                return item
                    .replace(alias.value, alias.key + '/')
                    .replace(/^\//g, '');
            }

            return p;
        });

        const _o = function () {
                return '{}'
            },
            _r = function () {
                return '[]'
            },
            _f = function () {
                return 'function(){return !1;}'
            };

        _deps.push(_o, _o, _f, _r);

        return _deps;
    }
}