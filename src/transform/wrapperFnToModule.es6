/**
 * Created by june on 2017/3/7.
 */
import jscodeshift from 'jscodeshift';
import Pipeable from '../tookit/Pipeable';
import {warning} from '../tookit/tookit';

export default function wrapperFnToModule(input) {
    let ast;
    try {
        ast = parse(input);
    } catch (e) {
        warning('wrapperFnToModule', e);
        return {
            type: 0,
            text: input
        }
    }

    const pipeline = new Pipeable({ast});

    pipeline.pipe(source => {
        return replaceReturnWithModule(source);
    }).pipe(source => {
        return removeWrapperFunction(source);
    });

    const text = pipeline.getResult().ast.toSource();
    /**
    console.log(`---- input ----`);
    console.log(input);
    console.log('\n');
    console.log(`---- output ----`);
    console.log(text);
    */
    return Object.assign(pipeline.getResult(), {
        text
    });
}

function removeWrapperFunction(source) {
    const type = source.type;

    // 无 Return 或 仅单个 Return
    if (type === 0
        || type === 1) {
        const wrapperFunction = findWrapperFunction(source.ast);
        const functionPlaceholder = wrapperFunction.parent;
        const blockStatementBody = wrapperFunction.value.body;

        // Remove Function Wrapper
        functionPlaceholder.value.body = blockStatementBody.body;
        return source;
    }
    return source;
}

function replaceReturnWithModule({ast}) {
    const topReturnStates = find(ast, jscodeshift.ReturnStatement, path => isTopReturn(path));

    if (topReturnStates.length === 0) {
        return {
            type: 0,
            ast: ast
        }
    }

    if (topReturnStates.length > 1) {
        return {
            type: 2,
            ast: ast
        }
    }
    const topReturnStatement = topReturnStates[0];
    topReturnStatement.replace(createModuleAst(topReturnStatement.value.argument).value);

    return {
        type: 1,
        ast: ast
    }
}

// 找到包裹层 function
function findWrapperFunction(ast) {
    const wrapperFunction = find(ast, jscodeshift.FunctionDeclaration);
    return wrapperFunction[0];
}

function parse(input) {
    return jscodeshift(input);
}

function find(ast, statement, isOk) {
    const matched = ast.find(statement);
    const list = [];
    // all
    if (!isOk) {
        matched.forEach(path => {
            list.push(path);
        });
        return list;
    }

    // select
    matched.forEach(path => {
        if (isOk(path)) {
            list.push(path);
        }
    });
    return list;
}


function createModuleAst(expressionRight) {
    const exportExpression = find(parse(`module.exports=1`), jscodeshift.ExpressionStatement)[0];
    exportExpression.value.expression.right = expressionRight;
    return exportExpression;
}

function isTopReturn(path) {
    let node = path;
    let funcScopeCount = 0;

    while (node.parent) {
        // 直接跳出
        if (funcScopeCount > 1) {
            return false;
        }

        if (~node.value.type.indexOf('Function')) {
            funcScopeCount++;
        }
        node = node.parent;
    }

    return funcScopeCount === 1;
}