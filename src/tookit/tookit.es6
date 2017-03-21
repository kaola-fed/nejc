import {js_beautify} from 'js-beautify';
import gutil from 'gulp-util';
import minimatch from 'minimatch';

export const log = (...args) => {
    gutil.log(gutil.colors.green(args[0]), args[1], args[2]);
};

export const warning = (...args) => {
    gutil.log(gutil.colors.magenta('Warning'), args[0], args[1]);
};

export const replaceEmail = (result) => {
    return result.replace(/\@corp\.netease\.com/i, '')
};

export const isInLibs = (libs, item) => {
    return libs.filter(lib => ((item === lib) || item.startsWith(`${lib}/`))).length > 0;
};


export const replaceWrapFunctionHead = (result, str) => {
    return result.replace(/^\s*function[^(]*\([^)]*\)\s*\{/, str);
};

export const hackCircleDependencies = (currentFile, text) => {
    /**
     * Hack Windows Sep
     * @type {*}
     */
    const file = currentFile.replace(/\\/g, '//');

    /**
     * Hack NEJ Circle Dependencies
     * @type {*}
     */
    if (~file.indexOf('base/element.js')
        || ~file.indexOf('base/event.js')) {
        return text.replace(/module\.exports.*$/, `\n\n for(var k in _p) {
    if (_p.hasOwnProperty(k)) {
        exports[k] = _p[k];
    }
}`);
    }
    return text;
};


export function render(depStr, fn) {
    return `${depStr}

${fn}`
}

export function jsBeatify(text) {
    return js_beautify(text, {indent_size: 4})
}

export function isIgnore (filePath, ignores) {
    return ignores.some(function (item) {
        return minimatch(filePath, item, { matchBase: true })
    });
}