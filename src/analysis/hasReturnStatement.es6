import jscodeshift from 'jscodeshift';

class HasReturnStatement {
    constructor(input) {
        this.input = input;
    }

    compile() {
        let size = 0;
        let loc = {};
        try {
            const node = jscodeshift(this.input);
            const source = node.toSource();
            node.find(jscodeshift.ReturnStatement)
                .forEach((path) => {
                    if (HasReturnStatement.isTopReturn(path)) {
                        if (!path.value.argument) {
                            return 0;
                        }
                        const arg = path.value.argument.name;
                        size++;
                        const start = path.value.start - 50;

                        const result = new RegExp('return\\s+' + arg + '[\s;]').exec(this.input.slice(start, start + 100));

                        // Hack path.value.start 不准
                        loc = {
                            start: start + result.index,
                            end: start + result.index + 7,
                        }
                    }
                });

        } catch(err) {
            return {
                hasReturn: true,
                size: 2,
                loc: {}
            }
        }

        return {
            hasReturn: size > 0,
            size,
            loc
        };
    }

    static isTopReturn(path) {
        let node = path;
        let funcScopeCount = 0;

        while (node.parent) {
            // 直接跳出
            if (funcScopeCount > 1) {
                return false;
            }

            if (~node.value.type.indexOf('Function')) {
                funcScopeCount ++;
            }
            node = node.parent;
        }

        return funcScopeCount === 1;
    }
}

export default HasReturnStatement;