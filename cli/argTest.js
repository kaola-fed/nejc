/**
 * Created by june on 2017/1/5.
 */
var argTest = function (option) {
    var key,value;
    for(var attr in option.alias){
        if(!option.alias[attr].startsWith('/')){
            key = 'alias[alias.xxx]';
            value = '绝对路径';
            break;
        }
    }
    if(key){
        return {
            key: key,
            value: value
        }
    }
};
module.exports = argTest;