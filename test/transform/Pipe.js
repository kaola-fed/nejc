/**
 * Created by june on 2017/3/2.
 */
var Pipeable = require('../../src/transform/Pipeable').default;
var expect = require('chai').expect;
var cwd = process.cwd();
var path = require('path');



describe('Pipeable', function () {

    it('.pipe', function () {
        const pipeable = new Pipeable(1);
        const value = pipeable.pipe(function (source) {
            return source + 1;
        }).getResult();
        expect(value).to.be.equal(2)
    });

});

