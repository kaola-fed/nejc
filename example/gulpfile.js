/**
 * Created by june on 2017/3/2.
 */

const gulp = require('gulp');
const nejc = require('../index');
const path = require('path');
const config = {
    'src': 'nej-nej/**/*',
    'dist': 'nej-commonjs',
    'ignoreFiles': ['nes'],
    'ext': ['.js'],
    'alias': {
        lib: path.resolve('./nej-nej'),
    },
    'outputAlias': {},
    'mode': 1
};


gulp.task('default', function () {
    return gulp
        .src(config.src)
        .pipe(nejc(config))
        .pipe(gulp.dest(config.dist));
});