/**
 * Created by june on 2017/3/6.
 */
const App = require('../lib/app');
const path = require('path');
const expect = require('chai').expect;

describe('App', function () {
    it('reduceAlias', function () {
        const res = App.reduceAlias({
            'regular': '/modules/regualar'
        });
        expect(res[0].value).to.be.equal('/modules/regualar');
    })
});
