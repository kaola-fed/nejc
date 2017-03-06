/**
 * Created by june on 2017/3/6.
 */
var App = require('../src/app').default;
var expect = require('chai').expect;

describe('App', function () {
    it('mergeLibs', function () {
        var res = App.mergeLibs({

        }, ['regularjs']);
        expect(res.regularjs).to.be.equal('/excludelibs/regularjs/');
    });

    it('reduceAlias', function () {
        var res = App.reduceAlias({
            'regular': '/modules/regualar'
        });
        expect(res[0].value).to.be.equal('/modules/regualar');
    })
});