# NejC
[![Build Status][travis-image]][travis-url]
> NejC 是一个 [nej](https://github.com/genify/nej) => commonjs 规范的大胆尝试，目前还在密集开发阶段。

## 介绍
查看 [介绍](./docs/intro.md)
 
## 如何体验
### 一、CLI 式
#### Step 1. 安装 NejC 到全局
```bash
$ npm i --global nejc
```

#### Step 2. 根据 [文档](./docs/start.md) 编写一个符合你需求的 nejc.config.js
```bash
$ cd /path/to/project
$ touch nejc.config.js # 创建 nejc.config.js
```

```javascript
module.exports = {
    'src': 'src/mobileweb-helper',
    'dist': 'build/node_modules/mobileweb-helper',
	'ext': ['.js'],
	'libs': [
    	'mobileweb-helper',
        'mobileweb-ui',
        'mobileweb-mcss',


        'regularjs',
        'iscroll',
        'hammerjs',
        'html2canvas'
    ],

    'replaceArgs': {
    	'regularjs': 'Regular',
    	'hammerjs': 'Hammer',
        'html2canvas': 'html2canvas'
    },
    'alias': {
        'lib': '/node_modules/nej/'
    },
    'outputAlias': {
        'nej-commonjs': '/node_modules/nej/'
    },
    'mode': 2,
    'features': ['arrow', 'for-of', 'for-each', 'arg-rest', 'arg-spread', 'obj-method', 'obj-shorthand', 'no-strict', 'exponent', 'multi-var'],
    'plugins': [
        function (source) {
            return source.replace(/\.\_\$bind/g, '.bind');
        }
    ]
}
```
#### Step 3. 执行 nejc，并静静等待
```bash
$ nejc
```

### 二、Gulp Plugin 式
#### Step 1. 安装 NejC 到工程
```bash
$ cd /path/to/project
$ npm i --save nejc
```
#### Step 2. 根据 [文档](./docs/start.md) 编写一个符合你需求的 配置 `gulpfile.js`
```javascript
const gulp = require('gulp');
const nejc = require('../index');
const path = require('path');
const config = {
	/**
	** Here is nejc.config.js
	*/
}

gulp.task('default', function () {
    return gulp
        .src(config.src)
        .pipe(nejc(config))
        .pipe(gulp.dest(config.dist));
});
```
#### Step 3. 执行 Gulp 并静默等待
```bash
$ cd /path/to/project
$ gulp
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
