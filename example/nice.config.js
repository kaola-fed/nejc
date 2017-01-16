var path = require('path');
module.exports = {
    'src': 'nej-nej',
    'dist': 'nej-commonjs',
    'syntax': 'commonjs',
    'ignoreFiles': ['nes'],
    'ext': ['.js'],
    'alias': {
        lib: path.resolve('./nej-nej'),
    },
    'outputAlias': {},
    'mode': 2
};
