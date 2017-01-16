/**
 * Created by june on 2017/1/3.
 */
var path = require('path');
require('../src/index')({
    'src': 'demo',
    'dist': 'dist',
    'syntax': 'es6',
    'alias': {
    },
    'outputAlias': {
        // lib: ''
    }
});
