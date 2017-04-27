const Analysis = require('nejc/lib/analysis');
const analysis = new Analysis({
    file: './test.js'
})
console.log(analysis.analysis(`define(['regularjs/index.js'], function(){});`))