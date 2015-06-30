/*eslint max-len:0 */
var reduceFunctionCall = require('reduce-function-call');
module.exports = function transformStrip (value) {
    return reduceFunctionCall(value, 'strip', function (argString) {

        var
            args = argString.split(','),
            rawValue,
            parsedValue;

        switch (args.length) {
            case 0:
                throw new SyntaxError('Not enough arguments passed `strip()`. Expected one. Did not receive any.');
            case 1:
                rawValue = args[0];
                if (rawValue === '') {
                    throw new SyntaxError('No valid arguments passed `strip()`. Expected one. Got "' + argString + '",');
                }
                break;
            default:
                throw new SyntaxError('Too many args passed to `strip()`. Expected one. Got "' + argString + '",');
        }

        parsedValue = parseFloat(rawValue);

        if (isNaN(parsedValue)) {
            throw new TypeError('Could not parse `strip(' + argString + ')`. Got `NaN`');
        }

        return parsedValue;
    });
};
