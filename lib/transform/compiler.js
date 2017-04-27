const Pipeable =require( '../tookit/Pipeable');
const wrapperFnToModule =require( './wrapperFnToModule');
const {replaceWrapFunctionHead, hackCircleDependencies} =require( '../tookit/tookit');


module.exports = function compile({input, ap, depStr = '', file = ''}) {
    const source = replaceWrapFunctionHead(input, matched => {
        return 'function module_exports () {' + '\n' + (depStr || '');
    });

    const pipeable = new Pipeable(source);

    pipeable.pipe(function (source) {
        return wrapperFnToModule(source);
    }).pipe(({type, text = ''}) => {
        // 无 Return ，且有 Auto Return 传参
        if (type === 0 && ap) {
            text = (text||'') + `module.exports = ${ap};`;
        }
        return {
            text,
            type
        }
    }).pipe(({type, text}) => {
        // Nothing
        if (type === 1) {
            text = (text||'') + `;`;
        }
        return {type, text};
    }).pipe(({type, text}) => {
        if (type === 2) {
            text += 'module.exports = module_exports.apply(this);'
        }
        return {type, text};
    }).pipe(({type, text}) => {
        return {
            type,
            text: hackCircleDependencies(file, text)
        };
    });

    return pipeable;
};
