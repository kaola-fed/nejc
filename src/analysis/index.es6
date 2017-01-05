import NEJParser from './NEJParser';

export default class Analysis {
    constructor(opt) {
        Object.assign(this, opt);
    }

    analysis(source) {
        let map;
        let compiler;
        try {
            /**
             * Compiler Function
             */
            compiler = this.createCompileFunction(source);

        } catch (err) {
            console.log(`[Warning] 生成编译函数失败，输出源码: ${this.file} `);
            return -1;
        }

        try{
            map = compiler(NEJParser, this.alias);
        }catch (err){
            // console.log(`${this.file}文件转换 Commonjs 异常，输出源码`);
            console.log(err)
            return -1;
        }

        return map;
    }

    createCompileFunction(source) {
        return new Function('NEJParser', 'alias', `
            var NEJ = new NEJParser({alias: alias, uri: '${this.file}'});
            
            var define = NEJ.define.bind(NEJ);
            /**
             * define start
             */
            ${source}
            /**
             * define end
             */
            return NEJ.getResult();
        `);
    }
};
