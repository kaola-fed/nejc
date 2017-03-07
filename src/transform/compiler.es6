import Pipeable from '../tookit/Pipeable';
import wrapperFnToModule from './wrapperFnToModule';
import {replaceWrapFunctionHead, hackCircleDependencies} from '../tookit/tookit';


export default function compile({input, ap, depStr = '', file = ''}) {
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

        }
        return {type, text};
    }).pipe(({type, text}) => {
        if (type === 2) {
            text += 'module.exports = module_exports.apply(window);'
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
