var NEJParser = require('../../src/analysis/NEJParser').default;
var Analysis = require('../../src/analysis');
var expect = require('chai').expect;
var filename = __filename;
var cwd = __dirname;
var path = require('path');

var alias1 = [
    {
        key: 'pro',
        value: '/Users/june/Desktop/Projects/kaola-shop-front/src/main/webapp/src/javascript/',
    },{
        key:'lib',
        value: '/Users/june/Desktop/Projects/kaola-shop-front/src/main/webapp/src/javascript/kaola-fed-lib/lib/nej/src/',
    },{
        key: 'h5lib',
        value: 'Users/june/Desktop/Projects/kaola-shop-front/src/main/webapp/src/javascript/kaola-fed-lib/components/h5/'
    },{
        key: 'fedlib',
        value: 'Users/june/Desktop/Projects/kaola-shop-front/src/main/webapp/src/javascript/kaola-fed-lib/'
    }
];

describe('_doFormatURI', function () {


    it('分析入参1', function () {
        var uri = '1.js';
        var deps = [];
        var temp = function () {
        };
        var res = new NEJParser({}).doFormatARG(uri, deps, temp);
        expect(res[0]).to.be.equal(uri);
        expect(res[1]).to.be.equal(deps);
        expect(res[2]).to.be.equal(temp);
    });

    it('分析入参2', function () {
        var uri = '1.js';
        var deps = [];
        var temp = function () {
        };
        var res = new NEJParser({}).doFormatARG(temp, uri, deps);
        expect(res[0]).to.be.equal(uri);
        expect(res[1]).to.be.equal(deps);
        expect(res[2]).to.be.equal(temp);
    });

    it('分析入参3', function () {
        var uri = '1.js';
        var deps = [];
        var temp = function () {
        };
        var res = new NEJParser({}).doFormatARG(deps, uri, temp);
        expect(res[0]).to.be.equal(uri);
        expect(res[1]).to.be.equal(deps);
        expect(res[2]).to.be.equal(temp);
    });

    it('相对路径', function () {
        var res = new NEJParser({}).doFormatURI('./index.js', filename);
        expect(res).to.be.equal(path.join(cwd, 'index.js'));
    });

    it('绝对路径', function () {
        var nejParser = new NEJParser({});
        var res = nejParser.doParsePlugin('./index.js');
        var result = nejParser.doFormatURI(res[0], '/Users/june/Desktop/Projects/nice/test/analysis/index2.js', res[2]);
        expect(result).to.be.equal('/Users/june/Desktop/Projects/nice/test/analysis/index.js');
    });

    it('lib变量+不定义', function () {
        var nejParser = new NEJParser({});
        var res = nejParser.doParsePlugin('{lib}index.js');
        var result = nejParser.doFormatURI(res[0], '/Users/june/Desktop/Projects/nice/test/analysis/index2.js', res[2]);
        expect(result).to.be.equal('/Users/june/Desktop/Projects/nice/test/analysis/lib/index.js');
    });

    it('lib变量+定义', function () {
        var nejParser = new NEJParser({
            alias: [
                {
                    key: 'lib',
                    value: '/Users/june/Desktop/Projects/lib/'
                }
            ]
        });
        var res = nejParser.doParsePlugin('{lib}index.js');
        var result = nejParser.doFormatURI(res[0], '', res[2]);
        expect(result).to.be.equal('/Users/june/Desktop/Projects/lib/index.js');
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
        var result = nejParser.doFormatURI(res[0], '', res[2]);
        expect(result).to.be.equal(cwd + '/platform/config.js');
    });

    it('变量', function () {
        var nejParser = new NEJParser({
            alias: alias1
        });
        var res = nejParser.doParsePlugin('h5lib/helper/util');
        var result = nejParser.doFormatURI(res[0], '', res[2]);

        expect(result).to.be.equal(cwd + '/lib/h5lib/helper/util.js');
    });

    it('变量2', function () {
        var nejParser = new NEJParser({
            alias: alias1
        });
        var res = nejParser.doParsePlugin('base/klass');
        var result = nejParser.doFormatURI(res[0], '', res[2]);

        expect(result).to.be.equal(cwd + '/lib/base/klass.js');
    });


    it('插件分析1', function () {
        var res = new NEJParser({}).doParsePlugin('text!index.html');
        expect(res[1] + '!' + res[0]).to.be.equal('text!index.html');
    });

    it('插件分析2', function () {
        var res = new NEJParser({}).doParsePlugin('json!index.json');
        expect(res[1] + '!' + res[0]).to.be.equal('json!index.json');
    });

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
