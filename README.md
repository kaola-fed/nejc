# NejC
[![Build Status][travis-image]][travis-url]
> NejC 是一个 [nej](https://github.com/genify/nej) => commonjs 规范的大胆尝试，目前还在密集开发阶段。

## 介绍
查看 [介绍](./docs/intro.md)
 
## 如何体验
### 一、cli 式
1. 安装 NejC 到全局
```bash
$ npm i --global nejc
```

2. 根据 [文档](./docs/start.md) 编写一个符合你需求的 nejc.config.js
```bash
$ cd /path/to/project
$ touch nejc.config.js # 创建 nejc.config.js
```
3. 执行 nejc，并静静等待
```bash
$ nejc
```

### 二、Gulp Plugin 式
1. 安装 NejC 到工程
```bash
$ cd /path/to/project
$ npm i --save nejc
```
2. 根据 [文档](./docs/start.md) 编写一个符合你需求的 nejc.config.js

3. 配置 `gulpfile.js`
```javascript
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
```


## 关于贡献代码
1. 在 Issues 栏中新建一个 Issue
2. Fork 本仓库
3. 新建分支，并 commit 你的代码，commit title 是 fix #${Issue Number}
4. Pull request

All done

## 关于输出
* [NEJ-CommonJS](https://www.npmjs.com/package/nej-commonjs) 
* [NEJ-ES6](https://www.npmjs.com/package/nej-es6) 

## LICENSE
[![license][license-image]][license-url]

[license-url]: https://github.com/kaola-fed/NEK/blob/master/LICENSE
[license-image]: https://img.shields.io/github/license/kaola-fed/NEK.svg

[travis-image]: https://travis-ci.org/kaola-fed/NejC.svg?branch=master
[travis-url]: https://travis-ci.org/kaola-fed/NejC
