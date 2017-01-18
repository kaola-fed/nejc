/**
 * Created by june on 2017/1/18.
 */
var path = require('path');
module.exports = {
    'src': 'nej-nej',
    'dist': 'nej-es6',
    'syntax': 'es6',
    'ignoreFiles': ['nes'],
    'ext': ['.js'],
    'alias': {
        lib: path.resolve('./nej-nej'),
    },
    'outputAlias': {},
    'mode': 2
};
