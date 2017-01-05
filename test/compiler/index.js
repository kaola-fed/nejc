var hasReturnStatement = require('../../src/transform/hasReturnStatement').default;
var expect = require('chai').expect;
var cwd = process.cwd();
var path = require('path');



describe('是否有 return', function () {

    it('无 return', function () {
        var res = new hasReturnStatement('function moduleExports (){  };').compile();
        expect(res).to.be.equal(false);
    });

    it('有 return', function () {
        var res = new hasReturnStatement('function moduleExports (){  return 1};').compile();
        expect(res).to.be.equal(true);
    });

    it('无 return', function () {
        var res = new hasReturnStatement('function moduleExports (){  function a(){return 1}};').compile();
        expect(res).to.be.equal(false);
    });
    it('有 return', function () {
        var res = new hasReturnStatement('function moduleExports (){  return function a(){return 1}};').compile();
        expect(res).to.be.equal(true);
    });

});

