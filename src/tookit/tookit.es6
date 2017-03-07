import {js_beautify} from 'js-beautify';

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
        return text.replace(/module\.exports/, '\n\n module.exports.__proto__');
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