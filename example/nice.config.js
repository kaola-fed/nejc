var path = require('path');
module.exports = {
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
};