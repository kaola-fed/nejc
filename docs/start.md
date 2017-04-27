## 配置与启动

```bash
$ nice [-c] [nice.config.js]
```

### config.src@String (必须)
nej 模块化方式组织的代码路径，以下称源码，填写绝对路径

### config.dist@String (必须)
转换后代码的期望输出路径，填写绝对路径

### config.mode@Number (可选)
模式选择，可选值: "1", "2"
1. ES5(Default)
2. ES6 

### config.alias@Object (可选)
对应 nej 中的 路径配置(https://github.com/genify/nej/blob/master/doc/DEPENDENCY.md#路径配置)
```javascript
alias: {
    lib: path.resolve(__dirname, 'nej-nej')
}
```
当解析器识别到脚本 a.js 的依赖路径中有 `lib` 变量，会将 `lib` 转换成真实路径，再计算该真实路径相对 a.js 的路径

注： 尽可能填写真实的绝对路径

### config.outputAlias@Object (可选)
```javascript
outputAlias: {
    nej: path.resolve('./nej-nej')
}
```
当转换器识别到脚本 a.js 的依赖的真实路径中存在 path.resolve('./nej-nej') 时，会替换为别名 `nej-nej`

注： 尽可能填写真实的绝对路径

### config.ext@Array<String> (可选)
进行处理的文件扩展名，默认 ['.js']

### config.ignoreFiles@Array<String> (可选)
不进行转换处理的文件，格式别写规则查看 [minimatch](https://github.com/isaacs/minimatch)
```javascript
ignoreFiles: ['*.es6']
```

### config.isPatch@Boolean (可选)
对应 nej 的 [平台适配系统](https://github.com/genify/nej/blob/master/doc/PLATFORM.md)。  
设置为 true 会将 patch 包带上。默认 false。

### config.replaceArgs@Object (可选)
nej 的模块化方案，无法直接使用 umd 兼容方案的包，所以我们经常会做一份兼容，如：
```
defien([
    'pro/xx/xx/regular'
], function(R) {
    new Regular()
})
```

而转换后，regularjs 我们将使用 npm 上的包，所以期望的是将 'R' 转换成真实的 regularjs 使用对象 Regular。

那么我们可以如下配置：
```javascript
replaceArgs: {
    'pro/xx/xx/regular': 'Regular'
}
```
