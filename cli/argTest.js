/**
 * Created by june on 2017/1/5.
 */
const path = require('path');
const os = require('os');

function absAliasPaths(alias) {
    Object.keys(alias).forEach(key => {
        alias[key] = alias[key].split(path.sep).filter(item => !!item).reduce((prev, item) => {
            return path.resolve(prev, item);
        }, os.homedir());
    });
}

module.exports = function (option) {
    absAliasPaths(option.alias);
    absAliasPaths(option.outputAlias);
};
