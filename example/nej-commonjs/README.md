# NEJ-CommonJS

## 如何引入
```bash
$ npm i --save nej-commonjs
```

## webpack 配置 imports-loader 
```bash
$ npm i --save imports-loader
```
``` javascript
module.exports = {
    module: {
        loaders: [
            {
                test: /nej\-commonjs/,
                loader: "imports-loader?this=>window"
            }
        ]
    }
};
```