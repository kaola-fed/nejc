/**
 * Created by june on 2017/1/18.
 */
var path = require('path');
module.exports = {
    'src': 'nej-nej',
    'dist': 'nej-es6',
    'ignoreFiles': ['nes'],
    'ext': ['.js'],
    'alias': {
        lib: path.resolve('./nej-nej'),
    },
    'outputAlias': {},
    'mode': 2,
    'replaceArgs': {}
    // 'features': ['arrow', 'for-of', 'for-each', 'arg-rest', 'arg-spread', 'obj-method', 'obj-shorthand', 'no-strict', 'exponent', 'multi-var']
};
