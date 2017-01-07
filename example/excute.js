/**
 * Created by june on 2017/1/3.
 */
var path = require('path');
require('../src/index')({
    'src': 'nej-nej',
    'dist': 'nej-commonjs',
    'ignoreFiles': ['nes'],
    'ext': ['.js'],
    'alias': {
        lib: path.resolve('./nej-nej'),
    },
    'outputAlias': {
        // lib: ''
    }
});
