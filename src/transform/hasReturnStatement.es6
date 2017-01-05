import jscodeshift from 'jscodeshift';


class HasReturnStatement {
    constructor(input) {
        this.input = input;
    }

    compile() {
        let len = 0;
        jscodeshift(this.input)
            .find(jscodeshift.ReturnStatement)
            .forEach(function (path) {
                const root = path.parentPath
                    .parentPath
                    .parentPath
                    .parentPath
                    .parentPath
                    .parentPath; //outer
                if (root.name === null) {
                    len++;
                    return 1;
                }
            });
        return len > 0;
    }
}

export default HasReturnStatement;