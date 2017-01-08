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
  'outputAlias': {
  }
};
