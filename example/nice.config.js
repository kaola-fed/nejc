var path = require('path');
module.exports = {
    'src': 'src',
    'dist': 'dist',
    'ignoreFiles': ['nes'],
    'ext': ['.js'],
    'alias':{
        lib: path.resolve('./src/nej/src/'),
        platform: path.resolve('./platform/')
    }
};