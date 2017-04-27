const {js_beautify} = require('js-beautify');
const gutil = require('gulp-util');
const minimatch = require('minimatch');
const path = require('path');
const isPathAbs = require('path-is-absolute');

const log = (...args) => {
    gutil.log(gutil.colors.green(args[0]), args[1], args[2]);
};


const warning = (...args) => {
    gutil.log(gutil.colors.magenta('warning'), args[0], args[1]);
};

const isInLibs = (libs, item) => {
    return libs.filter(lib => ((item === lib) || item.startsWith(`${lib}/`))).length > 0;
};


const replaceWrapFunctionHead = (result, str) => {
    return result.replace(/^\s*function[^(]*\([^)]*\)\s*\{/, str);
};

const hackCircleDependencies = (currentFile, text) => {
    /**
     * Hack Windows Sep
     * @type {*}
     */
    const file = currentFile.replace(/\\/g, '//');

    /**
     * Hack NEJ Circle Dependencies
     * @type {*}
     */
    if (/base[\/]+(element|event)\.js/g.test(file)) {
        return text.replace(/module\.exports.*$/, `\n\n for(var k in _p) {
    if (_p.hasOwnProperty(k)) {
        exports[k] = _p[k];
    }
}`);
    }
    return text;
};


function render(depStr, fn) {
    return `${depStr}

${fn}`
}

function jsBeatify(text) {
    return js_beautify(text, {indent_size: 4})
}

function isIgnore (filePath, ignores) {
    return ignores.some(function (item) {
        return minimatch(filePath, item, { matchBase: true })
    });
}

/**
 * Created by june on 2017/1/5.
 */

/**
 *
 * @param alias
 * @returns {Variable|*}
 * @example
 *
 * input:
 *  '/node_modules/lib/'
 * output:
 *  '/node_modules/lib'
 */
function absAliasPaths(alias) {
    return Object.keys(alias).reduce( (prev, key) => {
        prev[key] = alias[key].split(path.sep)
            .filter(item => !!item)
            .reduce((prev, item) => path.resolve(prev, item),  path.sep);
        return prev;
    }, {});
}

function argTester ({alias, outputAlias} = {}) {
    if (!isPathAbs(alias)) {
        return 'options.alias need be absolute path in your file system'
    }

    if (!isPathAbs(outputAlias)) {
        return 'options.outputAlias need be absolute path in your file system'
    }
}

exports.log = log;
exports.warning = warning;
exports.isInLibs = isInLibs;
exports.replaceWrapFunctionHead = replaceWrapFunctionHead;
exports.hackCircleDependencies = hackCircleDependencies;
exports.render = render;
exports.jsBeatify = jsBeatify;
exports.isIgnore = isIgnore;
exports.absAliasPaths = absAliasPaths;
exports.argTester = argTester;