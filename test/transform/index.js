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

     it('引入依赖都使用', function () {
        var res = new Transform({
            file: ''
        }).transform({
            d: [
                'regularjs',
                'html2canvas'
            ],
            sourceDeps: [
                'regularjs',
                'html2canvas'
            ],
            n: '',
            f: `function (Regular, HTML2canvas, p) {
    
            }`,
        });

        expect(/HTML2canvas/g.test(res)).to.be.equal(true)
    });


    it('引入依赖却不使用', function () {
        var res = new Transform({
            file: ''
        }).transform({
            d: [
                'regularjs',
                'html2canvas'
            ],
            sourceDeps: [
                'regularjs',
                'html2canvas'
            ],
            n: '',
            f: `function (Regular) {
    
            }`,
        });
        expect(/html2canvas/g.test(res)).to.be.equal(true)
    });

    it('引入依赖却不使用', function () {
        var res = new Transform({
            file: ''
        }).getVariable({
            d: [
                'regularjs',
                'html2canvas'
            ],
            n: '',
        }, ['Regular']);
        expect(/require\(\"\.\/html2canvas\"\)\;/g.test(res)).to.be.equal(true)
    })
});

describe('libs', function () {
    it('libs', function () {
        var deps = new Transform({
            libs: ['regularjs']
        }).reduceDeps([
            'regularjs/index.js'
        ], 'xxxx');
        expect(deps[0]).to.be.equal('regularjs/index.js');
    });

    it('libs2', function () {
        var deps = new Transform({
            libs: ['mobileweb-helper'],
        }).reduceDeps([
            'mobileweb-helper/extend/util'
        ], 'xxxx');
        expect(deps[0]).to.be.equal('mobileweb-helper/extend/util');
    });
});

describe('NULL', function () {
    it('NULL', function () {
        var transform = new Transform({
            libs: [],
            alias: [],
            file: ''
        });

        var res = transform.transform({
            d: [
                'NULL',
                'NULL',
            ],
            sourceDeps: [
                'NULL',
                'NULL',
            ],
            n: 'xxxx',
            f: `function(){}`
        });
        expect(res.match(/require/)).to.be.equal(null);
    });
})

describe('自动补齐 module.exports', function () {
    it('没有 module.exports ，要加 ', function () {
        var res = new Transform({
            alias: alias1,
            mode: 1,
            file: '/'
        }).transform({
            d: [],
            n: path.resolve(cwd,'index.js'),
            f: 'function(pro){}'
        });
        expect(!!~res.indexOf('module\.exports')).to.be.equal(true);
    });

    it('已有 module.exports ，不需要加', function () {
        var res = new Transform({
            alias: alias1,
            mode: 1,
            file: '/'
        }).transform({
            d: [],
            n: path.resolve(cwd,'index.js'),
            f: 'function(pro){return pro}'
        });
        expect(res.match(/module\.exports/g).length).to.be.equal(1);
    });
});

describe('mergeArgs', function () {
    it('替换变量', function () {
        var res = Transform.mergeArgs(
            [
                'regularjs'
            ],
            [
                '/node_modules/regularjs'
            ],
            [
                'R'
            ],
            {
                'regularjs': 'Regular'
            }
        );
        expect(res.args[0] === 'Regular').to.be.equal(!!1);
    });

    it('删除多余', function () {
        var res = Transform.mergeArgs(
            [
                'NULL'
            ],
            [
                'NUL121L'
            ],
            [
                'R'
            ],
            {
                'regularjs': 'Regular'
            }
        );
        expect((res.args.length === 0) && (res.deps.length === 0)).to.be.equal(true);
    });
});

