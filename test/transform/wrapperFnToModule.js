var wrapperFnToModule = require('../../src/transform/wrapperFnToModule').default;
var Transform = require('../../src/transform').default;

var res = new Transform({
    file: ''
}).transform({
    d: [
        'NULL',
        'NULL',
        '{}'
    ],
    sourceDeps: [
        'NULL',
        'NULL',
    ],
    n: 'xxxx',
    f: `function(p){}`
});

console.log(res);