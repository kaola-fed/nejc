var NEJParser = require('../../src/analysis/NEJParser').default;
var Analysis = require('../../src/analysis');
var expect = require('chai').expect;
var filename = __filename;
var cwd = __dirname;
var path = require('path');

var alias = [
    {
        key: 'pro',
        value: '/Users/june/Desktop/Projects/kaola-shop-front/src/main/webapp/src/javascript/',
    }, {
        key: 'lib',
        value: path.join(__dirname,'test')+'/',
    }, {
        key: 'h5lib',
        value: path.join(__dirname,'h5libdefine')+'/',
    }, {
        key: 'fedlib',
        value: '/Users/june/Desktop/Projects/kaola-shop-front/src/main/webapp/src/javascript/kaola-fed-lib/'
    }
];

describe('依赖路径分析', function () {

    it('相对路径', function () {
        var res = new NEJParser({}).doFormatURI('./index.js', filename);
        expect(res).to.be.equal(path.join(cwd, 'index.js'));
    });

    it('绝对路径', function () {
        var nejParser = new NEJParser({});
        var res = nejParser.doParsePlugin('./index.js');
        var result = nejParser.doFormatURI(res[0], path.join(__dirname,'index2.js'), res[2]);
        expect(result).to.be.equal(path.join(__dirname,'index.js'));
    });

    it('lib变量+不定义', function () {
        var nejParser = new NEJParser({});
        var res = nejParser.doParsePlugin('{lib}index.js');
        var result = nejParser.doFormatURI(res[0], path.join(__dirname,'index2.js'), res[2]);
        expect(result).to.be.equal(path.join(__dirname, 'lib', 'index.js'));
    });

    it('lib变量+定义', function () {
        var nejParser = new NEJParser({
            alias: alias
        });
        var res = nejParser.doParsePlugin('{lib}index.js');
        var result = nejParser.doFormatURI(res[0], '', res[2]);
        expect(result).to.be.equal(path.join(__dirname, 'test', 'index.js'));
    });

    it('platform变量+定义', function () {
        var nejParser = new NEJParser({
            alias: [
                {
                    key: 'platform',
                    value: './platform'
                }
            ]
        });
        var res = nejParser.doParsePlugin('{platform}config.js');
        var result = nejParser.doFormatURI(res[0], path.join(cwd, 'index.js'), res[2]);
        expect(result).to.be.equal(path.join(cwd, 'platform', 'config.js'));
    });

    it('变量', function () {
        var nejParser = new NEJParser({
            alias: alias
        });
        var res = nejParser.doParsePlugin('h5lib/helper/util');
        var result = nejParser.doFormatURI(res[0], '', res[2]);

        expect(result).to.be.equal( path.join(__dirname,'h5libdefine','helper', 'util.js'));
    });

    it('变量2', function () {
        var nejParser = new NEJParser({
            alias: alias
        });
        var res = nejParser.doParsePlugin('base/klass');
        var result = nejParser.doFormatURI(res[0], '', res[2]);

        expect(result).to.be.equal(path.join(__dirname,'test','base','klass.js'));
    });
});

describe('传参分析', function () {
    var uri = '1.js';
    var deps = [];
    var temp = function () {};

    it('分析入参1', function () {
        var res = new NEJParser({}).doFormatARG(uri, deps, temp);
        expect(res[0]).to.be.equal(uri);
        expect(res[1]).to.be.equal(deps);
        expect(res[2]).to.be.equal(temp);
    });

    it('分析入参2', function () {
        var res = new NEJParser({}).doFormatARG(temp, uri, deps);
        expect(res[0]).to.be.equal(uri);
        expect(res[1]).to.be.equal(deps);
        expect(res[2]).to.be.equal(temp);
    });

    it('分析入参3', function () {
        var res = new NEJParser({}).doFormatARG(deps, uri, temp);
        expect(res[0]).to.be.equal(uri);
        expect(res[1]).to.be.equal(deps);
        expect(res[2]).to.be.equal(temp);
    });

    it('依赖比传参多', function () {
        var res = new NEJParser({}).doFormatARG([
            'regularjs',
            'html2canvas'
        ], uri, function (Regular) {

        });
        expect(res[1].length).to.be.equal(2);
    })

});

describe('插件分析', function () {
    it('插件分析1', function () {
        var res = new NEJParser({}).doParsePlugin('text!index.html');
        expect(res[1] + '!' + res[0]).to.be.equal('text!index.html');
    });

    it('插件分析2', function () {
        var res = new NEJParser({}).doParsePlugin('json!index.json');
        expect(res[1] + '!' + res[0]).to.be.equal('json!index.json');
    });

    it('插件分析3', function () {
        var res = new NEJParser({}).doParsePlugin('regularjs');
        expect(res[0]).to.be.equal('regularjs');
    });
});

describe('demo', function () {
    it('demo1', function () {
        var analysis = new Analysis.default({
            alias: []
        });
        analysis.file = './test.js';
        var res = analysis.analysis(`define([], function(){});`);
        expect(res.n).to.be.equal('./test.js');
        expect(JSON.stringify(res.d)).to.be.equal('[]');
        expect(res.f.toString()).to.be.equal('function (){}');
    });
});

describe('libs', function () {
    it('libs', function () {
        var analysis = new Analysis.default({
            libs: ['regularjs']
        });
        analysis.file = './test.js';
        var res = analysis.analysis(`define(['regularjs/index.js'], function(){});`);

        expect(res.d[0]).to.be.equal('regularjs/index.js');
    });
});