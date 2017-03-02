## 如何创建一个符合你需求的 nice.config.js

```bash
$ nice [-c nice.config.js]
```

### config.src@String (必须)
要扫描的路径


### config.dist@String (必须)
输出的位置


### config.mode@String (可选)
可选属性: "1", "2"
1. ES5(Default)
2. ES6 

### config.alias@Object (可选)
```javascript
alias: {
    lib: path.resolve('./nej-nej')
}
```
当识别到依赖路径中有 `lib` 字段时，将转换成真实路径 path.resolve('./nej-nej')

### config.outputAlias@Object (可选)
```javascript
outputAlias: {
    nej: path.resolve('./nej-nej')
}
```
当识别到 依赖路径中有 `path.resolve('./nej-nej')` 出现时，将转换成 别名 `nej`，意图使输出代码兼容 Webpack 别名

### config.ext@Array<String> (可选)
支持处理的扩展名，默认 ['.js']