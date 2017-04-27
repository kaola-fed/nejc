const NEJParser = require('./NEJParser');
const {warning} = require('../tookit/tookit');

module.exports = class Analysis {
    constructor(opt) {
        Object.assign(this, opt);
    }

    analysis(source) {
        let map,
            compiler;

        try {
            compiler = Analysis.createCompileFunction(source);

        } catch (err) {
            warning(this.file, err);
            return -1;
        }

        try {
            map = compiler(NEJParser, {
                alias: this.alias,
                uri: this.file,
                libs: this.libs,
                isPatch: this.isPatch
            });
        } catch (err) {
            warning(this.file, err);
            return -1;
        }

        return map;
    }

    static createCompileFunction(source) {
        const fnStr = `
            var NEJ = new NEJParser(options);
            var define = NEJ.define.bind(NEJ);
            /**
             * define start
             */
            ${source}
            /**
             * define end
             */
            return NEJ.getResult();
        `;
        return new Function('NEJParser', 'options', fnStr);
    }
};
