require('./Pipe');

var Transform = require('../../src/transform').default;
var expect = require('chai').expect;
var cwd = process.cwd();
var path = require('path');

var alias1 = [
    {
        key: 'lib',
        value: '/Users/june/Desktop/Projects/kaola-shop-front/src/main/webapp/src/javascript/kaola-fed-lib/lib/nej/src/',
    }, {
        key: 'h5lib',
        value: '/Users/june/Desktop/Projects/kaola-shop-front/src/main/webapp/src/javascript/kaola-fed-lib/components/h5/'
    }, {
        key: 'fedlib',
        value: '/Users/june/Desktop/Projects/kaola-shop-front/src/main/webapp/src/javascript/kaola-fed-lib/'
    }, {
        key: 'pro',
        value: '/Users/june/Desktop/Projects/kaola-shop-front/src/main/webapp/src/javascript/',
    }
];


describe('依赖转换', function () {
    it('依赖转换', function () {
        var deps = new Transform({
            alias: alias1
        }).reduceDeps([
            '/Users/june/Desktop/Projects/kaola-shop-front/src/main/webapp/src/javascript/kaola-fed-lib/components/h5/helper/util.js'
        ], '/Users/june/Desktop/Projects/kaola-shop-front/src/main/webapp/src/javascript/pages/h5/index.js');
        expect(deps[0]).to.be.equal('h5lib/helper/util.js');
    });
});


describe('自动补齐 return ', function () {

    it('没有 return ，要加 ', function () {
        var res = new Transform({
            alias: alias1,
            mode: 1,
            file: '/'
        }).transform({
            d: [],
            n: path.resolve(cwd,'index.js'),
            f: 'function(pro){}'
        });
        expect(!!~res.indexOf('return')).to.be.equal(true);
    });

    it('已有 return ，不需要加', function () {
        var res = new Transform({
            alias: alias1,
            mode: 1,
            file: '/'
        }).transform({
            d: [],
            n: path.resolve(cwd,'index.js'),
            f: 'function(pro){return pro}'
        });
        expect(res.match(/return/g).length).to.be.equal(1);
    });
});