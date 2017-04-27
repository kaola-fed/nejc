var wrapperFnToModule = require('../../lib/transform/wrapperFnToModule');
var expect = require('chai').expect;
var path = require('path');

describe('函数 return 数量识别', function () {

    it('0', function () {
        var res = wrapperFnToModule('function moduleExports (){  };');
        expect(res.type).to.be.equal(0);
    });

    it('1', function () {
        var res = wrapperFnToModule('function moduleExports (){  return 1};');
        expect(res.type).to.be.equal(1);
    });

    it('0', function () {
        var res = wrapperFnToModule('function moduleExports (){  function a(){return 1}};');
        expect(res.type).to.be.equal(0);
    });
    it('1', function () {
        var res = wrapperFnToModule('function moduleExports (){  return function a(){return 1}};');
        expect(res.type).to.be.equal(1);
    });

});

