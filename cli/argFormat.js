/**
 * Created by june on 2017/1/5.
 */
const path = require('path');

function absAliasPaths(alias) {
    return Object.keys(alias).reduce( (prev, key) => {
        prev[key] = alias[key].split(path.sep)
            .filter(item => !!item)
            .reduce((prev, item) => path.resolve(prev, item),  path.sep);
        return prev;
    }, {});
}

module.exports = function (option) {
    return Object.assign(option, {
        alias: absAliasPaths(option.alias),
        outputAlias: absAliasPaths(option.outputAlias),
    });
};

module.exports.absAliasPaths = absAliasPaths;