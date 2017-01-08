/**
 * Created by june on 2017/1/3.
 */
'use strict';
// import 'babel-polyfill';
import gulp from 'gulp';
import App from './app';
import fs from 'fs';


module.exports = (opt) => {

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
