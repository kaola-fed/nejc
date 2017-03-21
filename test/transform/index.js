require('./Pipe');

var Transform = require('../../src/transform').default;
var expect = require('chai').expect;
var cwd = process.cwd();
var path = require('path');

var alias = [
    {
        key: 'lib',
        value: path.join(__dirname, 'lib', 'demo'),
    }
];


describe('依赖转换', function () {
    it('依赖转换', function () {
        var deps = new Transform({
            alias: alias
        }).reduceDeps([
            path.join(__dirname, 'util.js')
        ], path.join(__dirname));
        expect(deps[0]).to.be.equal('./util');
    });

    it('windows', function () {
        var deps = new Transform(
            { file: path.resolve('/index.js'),
            alias:
                [ { key: 'commonjs',
                    value:  path.resolve('/node_modules/commonjs') } ],
            mode: 2,
            features: undefined }).reduceDeps([path.resolve('/node_modules/commonjs/base/element.js')], path.join('/src/hello'));
        expect(deps[0]).to.be.equal('commonjs/base/element.js');
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
            p: []
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
            alias: alias,
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
            alias: alias,
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
