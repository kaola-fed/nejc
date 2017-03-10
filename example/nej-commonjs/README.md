# NEJ-CommonJS

## 如何引入
```bash
$ npm i --save-dev nej-commonjs
```

## webpack 配置 imports-loader 

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