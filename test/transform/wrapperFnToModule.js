var wrapperFnToModule = require('../../lib/transform/wrapperFnToModule');
var Transform = require('../../lib/transform');

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