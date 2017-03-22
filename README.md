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
const path = require('path')
module.exports = {
    'src': 'src/mobileweb-helper', // 输入文件夹 或 文件
    'dist': 'build/node_modules/mobileweb-helper', // 输出文件夹
	'ext': ['.js'],
	'libs': [ 
	    // 添加到 libs 下的包名，不会做路径转换；
	    // 否则会识别成 nej "base/element" 的形式 
    	'mobileweb-helper',
        'mobileweb-ui',
        'mobileweb-mcss',


        'regularjs',
        'iscroll',
        'hammerjs',
        'html2canvas'
    ],

    'replaceArgs': { 
        // 由于 nej 模块加载规范是自己的风格
        // 所以我们一般在使用时会用 placeholder 代替
        // 这个操作是将 placeholder 替换成暴露到 windows 上的变量
    	'regularjs': 'Regular',
    	'hammerjs': 'Hammer',
        'html2canvas': 'html2canvas'
    },
    
    'alias': {
        // 输入别名 => 将匹配 key 的模块名替换成 value （value为物理路径）
        'lib': path.join(__dirname, 'nej')
    },
    
    'outputAlias': {
        // 输出别名 => 将匹配 value 的路径别名成对应的 key
        'nej-commonjs': path.join(__dirname, 'nej')
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
     * Here is nejc.config.js
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
