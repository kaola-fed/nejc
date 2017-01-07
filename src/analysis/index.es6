import NEJParser from './NEJParser';

export default class Analysis {
    constructor(opt) {
        Object.assign(this, opt);
    }

    analysis(source) {
        let map,
            compiler;

        try {

            compiler = Analysis.createCompileFunction(source);

        } catch (err) {
            console.log(`[Warning] 生成编译函数失败，输出源码: ${this.file} `);
            return -1;
        }

        try {

            map = compiler(NEJParser, this.alias, this.file);

        } catch (err) {
            console.log(err);
            return -1;
        }

        return map;
    }

    static createCompileFunction(source) {
        const fnStr =  `
            var NEJ = new NEJParser({alias: alias, uri: currentFile});
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
        return new Function('NEJParser', 'alias', 'currentFile',fnStr);
    }
};
