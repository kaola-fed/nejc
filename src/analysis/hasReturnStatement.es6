import jscodeshift from 'jscodeshift';

class HasReturnStatement {
    constructor(input) {
        this.input = input;
    }

    compile() {
        let len = 0;
        try {
            jscodeshift(this.input)
                .find(jscodeshift.ReturnStatement)
                .forEach((path) => {
                    if (HasReturnStatement.getRoot(path).name === null) len++;
                });
        } catch(err) {
            console.log(this.input);
        }
        return len > 0;
    }

    static getRoot(path) {
        return path.parentPath
            .parentPath
            .parentPath
            .parentPath
            .parentPath
            .parentPath;
    }
}

export default HasReturnStatement;