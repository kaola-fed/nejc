import Analysis from './analysis';
import Transform from './transform';
import through2 from 'through2';
import gulpUtil from 'gulp-util';
import replaceExt from 'replace-ext';
import path from 'path';

const PluginError = gulpUtil.PluginError;

class App {
    constructor(opt) {

        Object.assign(this, {
            ext: ['.js']
        }, opt);

        let keys = Object.keys(opt.alias);

        this.alias = [];
        this.alias = keys.map(key => {
            return {
                key,
                value: opt.alias[key]
            }
        });

        this.alias.sort((before, after) => {
            return before.value.length <= after.value.length
        });
    }

    entry(opt) {
        return through2.obj((file, enc, cb) => {
            if (file.isNull())
                return cb(null, file);
            if (file.isStream())
                return cb(new PluginError('nice', 'Streaming not supported'));

            const options = {
                file: file.path,
                alias: this.alias
            };
            const sourceContent = file._contents.toString();
            const pathInfo = path.parse(file.path);

            if (~file.path.indexOf('test')) {
                return cb(null, file);
            }

            if (!~this.ext.indexOf(pathInfo.ext)) {
                return cb(null, file);
            }

            if (-1 === sourceContent.indexOf('define(')) {
                return cb(null, file);
            }

            try {
                this.getCommentState(sourceContent, file);
                let reg = /([\s\S]*?)((NEJ\.define)|(define))/g;
                let matched;
                const startIndex = (() => {
                    while (matched = reg.exec(sourceContent)) {
                        if (this.notInComment(matched.index + matched[1].length, matched[2].length)) {
                            return matched.index + matched[1].length;
                        }
                    }
                })();
                let firstCode = sourceContent.substr(0, startIndex);
                let matchedStr = sourceContent.substr(startIndex);

                const map = new Analysis(options).analysis(matchedStr);
                if (map === -1) {
                    return cb(null, file);
                }
                const content = new Transform(options).transform(map);

                file.contents = new Buffer([firstCode, content].join(''));
                file.path = replaceExt(file.path, '.js');

                cb(null, file);
            } catch (err) {
                cb(new PluginError('gulp_mcss', err));
            }
        });
    }

    getCommentState(input, file) {
        let commentState = this.commentState = [];
        let matched;
        let reg = /(\/\/)|(\/\*)|(\*\/)/g;

        while (matched = reg.exec(input)) {

            if (matched[1]) {
                let idx = matched.index;
                while (input[++idx] && input[idx] !== '\n') {}
                commentState.push({
                    start: matched.index,
                    end: idx
                });
            } else if (matched[2]) {
                /**
                 *
                 * @type {number}
                 */
                try {
                    let closeCommentIdx = matched.index + /\*\//g.exec(input.substr(matched.index)).index;
                    commentState.push({
                        start: matched.index,
                        end: closeCommentIdx + 2
                    });
                } catch (err) {
                }
            }
        }
    }

    notInComment(idx, len) {
        return !this.commentState.some(item => {
            return (item.start < idx && item.end > idx + len);
        });
    }
}

export default App;