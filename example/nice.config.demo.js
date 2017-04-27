var path = require('path');

require('../lib/index')({
    'src': './demo/index.js',
    'dist': 'dist',
    'ignoreFiles': ['nes'],
    'ext': ['.js'],
    'libs': ['pro'],
    'alias': {
        lib: path.join(__dirname, 'node_modules','a'),
    },
    'outputAlias': {
        nej2: path.join(__dirname, 'node_modules','a'),
    },
    'mode': 1,
    'isPatch': true
});
