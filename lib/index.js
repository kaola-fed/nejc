/**
 * Created by june on 2017/1/3.
 */
'use strict';
const gulp =require('gulp');
const App =require('./app');
const fs =require('fs');
const {argTester} =require('./tookit/tookit');

module.exports = (opt) => {

    let res;
    const app = new App(Object.assign({
        alias:{}
    }, opt));


    let stat;
    try {
        stat = fs.statSync(opt.src);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(error.message);
            return -1;
        }
    }
    if (stat.isDirectory()) {
        opt.src = `${opt.src}/**/*`
    }
    gulp
        .src(opt.src)
        .pipe(app.entry({}))
        .pipe(gulp.dest(opt.dist));
};
