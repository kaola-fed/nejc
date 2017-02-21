## 如何创建一个符合你需求的 nice.config.js

```bash
$ nice [-c nice.config.js]
```

### src@String (必须)
要扫描的路径


### dist@String (必须)
输出的位置


### mode@String (可选)
可选属性: "1", "2"
1. ES5(Default)
2. ES6 

### alias@Object (可选)
```javascript
alias: {
    lib: path.resolve('./nej-nej')
}
```
会把 lib => 输出成对应的绝对路径

### outputAlias@Object (可选)
```javascript
outputAlias: {
    lib: path.resolve('./nej-nej')
}
```
考虑到后期使用 Webpack ，可以有路径别名，此处操作是让依赖处理可以有别名操作。

### ext@Array<String> (可选)
支持处理的扩展名，默认 ['.js']