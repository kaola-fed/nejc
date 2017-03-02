/**
 * Created by june on 2017/3/2.
 */
const App = require('./dist/app').default;

module.exports =  function (config) {
    const app = new App(config);
    return app.entry({});
};