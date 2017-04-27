const path = require('path');
const {isInLibs} = require('../tookit/tookit');

const _g = global;

const _isTypeOf = function (_data, _type) {
    return Object.prototype.toString.call(_data) === '[object ' + _type + ']';
};

/*
 * 解析插件信息
 * @param  {String} _uri 地址
 * @return {Array}       插件信息
 */
const _doParsePlugin = (function () {
    const _pmap = ['text', 'json', 'regular'];

    return function (_uri) {
        const _brr = [];
        let _type, _arr = _uri.split('!');
        if (~_pmap.indexOf(_arr[0].toLowerCase())) {
            _type = _arr.shift();
        }
        _brr.push(_arr.join('!'));
        _brr.push(_type);
        return _brr;
    };
})();


/*
 * 格式化输入参数
 * @param  {String}   字符串
 * @param  {Array}    数组
 * @param  {Function} 函数
 * @return {Array}    格式化后的参数列表
 */
const _doFormatARG = function (_str, _arr, _fun) {
    const _args = [null, null, null],
        _kfun = [
            function (_arg) {
                return _isTypeOf(_arg, 'String');
            },
            function (_arg) {
                return _isTypeOf(_arg, 'Array');
            },
            function (_arg) {
                return _isTypeOf(_arg, 'Function');
            }
        ];
    for (let i = 0, l = arguments.length, _it; i < l; i++) {
        _it = arguments[i];

        for (let j = 0, k = _kfun.length; j < k; j++) {
            if (_kfun[j](_it)) {
                _args[j] = _it;
                break;
            }
        }
    }
    return _args;
};

/*
 * 格式化地址,取绝对路径
 * @param  {String} _uri 待格式化地址
 * @return {String}      格式化后地址
 */
const _doFormatURI = (function () {

    const _reg = /{(.*?)}/gi,
        _reg1 = /([^:])\/+/g,
        _reg3 = /[^\/]*$/,
        _reg4 = /\.js$/i,
        _reg5 = /^[{\/\.]/,
        _reg6 = /(file:\/\/)([^\/])/i;
    const _absolute = function (_uri) {
        return _uri.indexOf('://') > 0;
    };
    const _slash = function (_uri) {
        return _uri.replace(_reg1, '$1/');
    };

    const _root = function (_uri) {
        return _uri.replace(_reg3, '');
    };
    const _format = function (_uri) {
        return _uri.replace(_reg6, '$1/$2');
    };
    const _amdpath = function (_uri, _type, config) {
        if (_reg4.test(_uri) ||
            _reg5.test(_uri) ||
            _absolute(_uri)) {
            return _uri;
        }
        const _arr = _uri.split('/'),
            _path = config.root[_arr[0]],
            _sufx = !_type ? '.js' : '';
        if (!!_path) {
            _arr.shift();
            return _path + _arr.join('/') + _sufx;
        }
        return '{lib}' + _arr.join('/') + _sufx;
    };
    return function (_uri, _base, _type) {
        const __config = this._config;
        if (!_uri) return '';

        if (_absolute(_uri)) {
            return _format(_uri);
        }

        if (_base && _uri.indexOf('.') == 0) {
            _uri = _root(_base) + _uri;
        }

        _uri = _slash(_amdpath(_uri, _type, __config));

        const _uri2 = _uri.replace(
            _reg, function ($1, $2) {
                return (__config.root[$2] || $2) + '/';
            }
        );

        /**
         * 如果不是绝对路径，则相对于当前位置做处理
         * @type {*}
         * @private
         */
        const _abs = path.resolve(path.parse(_base).dir, _uri2);
        return {
            uri: _format(_abs),
            alias: (function (matched) {
                if (!matched || !matched[1] || __config[matched[1]]) {
                    return undefined;
                }
                return matched[1];
            }(new RegExp(_reg).exec(_uri)))
        };
    };
})();

const _doReduceUriInfo = function (deps) {
    const _patchList = [];
    const _deps = deps.map(dep => {
        const {uri, alias} = dep;

        if (!uri) {
            return dep;
        }

        if (/^\s*platform\s*$/.test(alias)) {
            _patchList.push(uri.replace(/\.[^.]*$/g, $1 => `.patch${$1}`));
        }
        return uri;
    });

    return {
        deps: _deps,
        patchList: _patchList
    }
};

class NEJParser {
    constructor({alias = [], uri = '', libs = []}) {
        this._config = {
            root: {}
        };
        this._setAlias(alias);
        this._setCurrentFile(uri);
        this._setLibs(libs);
    }

    define(_uri, _deps, _callback) {
        const _args = [].slice.call(arguments, 0);
        return this._doDefine.apply(this, _args);
    }

    _setCurrentFile(uri) {
        this.currentFile = uri;
    }

    _getCurrentFile() {
        return this.currentFile || '';
    }

    _setLibs(libs) {
        this.libs = libs;
    }

    _setAlias(alias) {
        const __config = this._config;
        __config.root = {
            platform: './platform/'
        };
        alias.forEach(item => {
            Object.assign(__config.root, {
                [item.key]: item.value
            });
        });
        return __config.root;
    }

    _doDefine(_uri, _deps, _callback) {
        const _args = _doFormatARG.apply(
            _g, arguments
        );
        const _libs = this.libs;
        _uri = this._getCurrentFile();
        _deps = _args[1] || [];
        _callback = _args[2] || function () {
                return !1
            };
        const _d = _deps.map((dep) => {
            // libs 里面 不处理
            if (isInLibs(_libs, dep)) {
                return dep;
            }
            const _arr = _doParsePlugin(dep);
            return this.doFormatURI.call(this, _arr[0], _uri, _arr[2]);
        });
        const {deps, patchList} = _doReduceUriInfo(_d);

        this.result = {
            n: _uri,
            d: deps,
            sourceDeps: _deps,
            patchList: patchList,
            f: _callback.toString()
        };
        return this.result;
    }

    doParsePlugin(...args) {
        return _doParsePlugin.apply(this, args);
    }

    doFormatURI(...args) {
        return _doFormatURI.apply(this, args);
    }

    doFormatARG(...args) {
        return _doFormatARG.apply(this, args);
    }

    getResult() {
        return this.result;
    }
}

module.exports = NEJParser;