# NEJ Transform To ES6 Modules Steps 

1. Replace mail suffix (Remove NetEase mail suffix);
2. Add "DEBUG" and "CMPT" default flag in 'global.js';
```javascript
    // DEBUG default false
    if (typeof DEBUG === 'undefined') {
        window.DEBUG = 0;
    }

    // 禁用兼容模式
    if (typeof CMPT === 'undefined') {
        window.CMPT = false;
    }
```
3. Export to window 
* util\query\nes.js(line 1271)
```javascript
  //          5.Exports
  // ----------------------------------------------------------------------
  // 暴露API:  amd || commonjs  || global 
  // 支持commonjs
  if (typeof exports === 'object') {
    module.exports = nes;
    // 支持amd
  } else if (typeof define === 'function' && define.amd) {
/* */define(function() {
      return nes;
    });
  }
  // 直接暴露到全局
  win.nes = nes;
```
* util\template\trimpath.js(line 48)
```javascript
if (typeof TrimPath==='undefined'){
    var TrimPath = {};
    window.trimPath = TrimPath;
    if (typeof exports!=='undefined')
        TrimPath = exports;
}
```

4. Rename Exports 
* util/ajax/jsonp.js(exports => p)