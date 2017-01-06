import Analysis from './analysis';
import Transform from './transform';
import Source from './source';
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

    entry() {
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

            /**
             * 测试代码直接复制
             */
            if (~file.path.indexOf('test')) {
                return cb(null, file);
            }

            if (!~this.ext.indexOf(pathInfo.ext)) {
                return cb(null, file);
            }

            if (!~sourceContent.indexOf('define(')) {
                return cb(null, file);
            }

            try {
                const {
                    firstCode,
                    matchedStr
                } = new Source().source(sourceContent);

                const map = new Analysis(options).analysis(matchedStr);

                if (-1 === map) {
                    return cb(null, file);
                }

                const content = new Transform(options).transform(map);

                file.contents = new Buffer([firstCode, content].join(''));
                file.path = replaceExt(file.path, '.js');

                cb(null, file);
            } catch (err) {
                cb(new PluginError('nice', err));
            }
        });
    }

}

export default App;