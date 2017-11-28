const postcss = require('postcss');
const reduceFunctionCall = require('reduce-function-call');

const PLUGIN_NAME = 'postcss-strip';

function stripTransform(node, result, argString, functionIdentifier) {
    argString = argString.trim();
    var args = argString.split(','),
        rawValue,
        parsedValue;

    switch (args.length) {
        case 0:
            result.warn(`Not enough arguments passed "${functionIdentifier}()". 
                Expected one. Did not receive any.`, { node: node });
            break;
        case 1:
            rawValue = args[0];
            if (rawValue === '') {
                result.warn(`No valid arguments passed "${functionIdentifier}()".
                    Expected one. Got "${argString}"`, { node: node });
            }
            break;
        default:
            result.warn(`Too many args passed to "${functionIdentifier}()". 
                Expected one. Got "${argString}"`, { node: node });
    }

    parsedValue = parseFloat(rawValue);

    if (isNaN(parsedValue)) {
        result.warn(`"${functionIdentifier}(${argString})" resulted in "NaN".
            Left original value in place.`, { node: node });
        return argString;
    }

    return parsedValue;
}


function transformValue(node, property, functionIdentifier, boundStripTransform) {
    var value = node[property];
    if (value === undefined || value.indexOf(functionIdentifier + '(') === -1) {
        return;
    }
    node[property] = reduceFunctionCall(value, functionIdentifier, boundStripTransform);
}

module.exports = postcss.plugin(PLUGIN_NAME, function (opts) {
    opts = Object.assign(
        {
            functionName : 'strip'
        },
        opts
    );

    return function (css, result) {
        css.walk(function (node) {
            const boundStripTransform = stripTransform.bind(null, node, result);
            if (node.type === 'atrule') {
                return transformValue(node, 'params', opts.functionName, boundStripTransform);
            } else if (node.type === 'decl') {
                return transformValue(node, 'value', opts.functionName, boundStripTransform);
            }
        });
    };
});
