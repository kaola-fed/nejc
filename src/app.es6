import Analysis from './analysis';
import Transform from './transform';
import Source from './source';
import through2 from 'through2';
import gulpUtil from 'gulp-util';
import replaceExt from 'replace-ext';
import path from 'path';
import {isIgnore} from './tookit/tookit';

const PluginError = gulpUtil.PluginError;

class App {
    /**
     * @param alias
     * @param outputAlias
     * @param libs
     * @param replaceArgs
     * @param plugins
     * @param ignoreFiles
     * @param ext
     * @param isPatch
     * @param mode
     */
    constructor({
        alias = {}, outputAlias = {}, libs = [],
        replaceArgs = {},
        plugins = [],
        ignoreFiles = [], ext = ['.js'],
        isPatch = false, mode = 1
    }) {
        Object.assign(this, {
            alias: App.reduceAlias(alias),
            outputAlias: App.reduceAlias(outputAlias),
            libs, replaceArgs, plugins, ignoreFiles, ext,
            isPatch, mode
        });

        this.alias.sort((before, after) => {
            return before.value.length <= after.value.length
        });
    }

    static reduceAlias(map = {}) {
        let keys = Object.keys(map);
        return keys.map(key => {
            return {
                key,
                value: map[key]
            }
        });
    }

    entry() {
        return through2.obj((file, enc, cb) => {
            if (file.isNull())
                return cb(null, file);
            if (file.isStream())
                return cb(new PluginError('nejc', 'Streaming not supported'));

            const options = {
                file:        file.path,
                alias:       this.alias,
                mode:        this.mode,
                replaceArgs: this.replaceArgs,
                plugins:     this.plugins,
                libs:        this.libs,
                isPatch:     this.isPatch
            };

            const sourceContent = file._contents.toString();
            const pathInfo = path.parse(file.path);

            if (isIgnore(file.path, this.ignoreFiles)) {
                return cb(null, file);
            }

            if (!~this.ext.indexOf(pathInfo.ext)) {
                return cb(null, file);
            }

            if (!~sourceContent.indexOf('define')) {
                return cb(null, file);
            }

            try {
                const {
                    firstCode,
                    matchedStr
                } = new Source().source(sourceContent);

                const map = new Analysis(options).analysis(sourceContent);

                if (-1 === map) {
                    return cb(null, file);
                }

                const content = new Transform(Object.assign(options, {
                    alias: (this.outputAlias || this.alias),
                    features: this.features
                })).transform(map);

                file.contents = new Buffer([
                    firstCode,
                    content].join(''));
                file.path = replaceExt(file.path, '.js');

                cb(null, file);
            } catch (err) {
                cb(new PluginError('nejc', err));
            }
        });
    }
}

export default App;
