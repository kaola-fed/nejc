var path = require('path');

require('../src/index')({
    'src': './demo/index.js',
    'dist': 'dist',
    'ignoreFiles': ['nes'],
    'ext': ['.js'],
    'alias': {
        lib: path.resolve('./nej-nej'),
    },
    'outputAlias': {},
    'mode': 1,
    'isPatch': true
});
