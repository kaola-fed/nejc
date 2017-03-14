/**
 * Created by june on 2017/3/6.
 */
const App = require('../src/app').default;
const path = require('path');
const argFormat = require('../cli/argFormat');
const expect = require('chai').expect;

describe('App', function () {
    it('reduceAlias', function () {
        const res = App.reduceAlias({
            'regular': '/modules/regualar'
        });
        expect(res[0].value).to.be.equal('/modules/regualar');
    })
});

describe('formatArgs',function () {
    it('absAliasPaths', function () {
        const res = argFormat.absAliasPaths({
            a: '/node_modules/a'
        });
        expect(res.a).to.be.equal(path.resolve(path.sep, 'node_modules', 'a'));
    })
});