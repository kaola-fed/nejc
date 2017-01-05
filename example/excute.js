/**
 * Created by june on 2017/1/3.
 */
var path = require('path');
require('../src/index')({
    'src': 'src',
    'dist': 'dist',
    'ignoreFiles': ['nes'],
    'ext': ['.js'],
    'alias':{
        lib: path.resolve('./src/nej/src/'),
        platform: path.resolve('./platform/')
    }
});
