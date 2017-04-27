
## [配置与启动](./start.md)

## 词汇表
* currentFile - 当前文件
* sourceDeps - 文件处理前的依赖
* dependencies - 处理后的依赖，每一项都为绝对路径
* patchList - 平台兼容包的列表，绝对路径
* fnStr - define 内方法体序列化后的结果
* 额外参数 - nej 中会自动往 define 内方法体追加额外参数


## 原理简介

nejc 对 nej 组织方式的代码（以下称为源码）做下面两件事情：

### Analysis：分析依赖并输出一个<依赖>结构
```javascript
{
    n: currentFile, // 当前文件
    sourceDeps: sourceDeps, // 处理前的依赖
    d: dependencies, // 处理后的依赖，每一项都为绝对路径
    patchList: patchList, // 平台兼容包的列表
    f: fnStr // define 内方法体序列化后的结果
}
```

### Transform： 数据 + 模板 => 输出  

根据 Analysis 过程生成的依赖结构，组织成 commonjs 方式的目标代码

1. 将 dependencies 转换为相对 currentFile 的路径
2. 拼装 patchList，并使用 `WITHPATCH` 变量，供 webpack.DefinePlugin 等工具外部控制 
3. 检查 fnStr，是否存在最外层的 returnStatement ，无 returnStatement 则 添加 return 第一个 额外参数 的逻辑