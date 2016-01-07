var postcss = require('postcss');
var helpers = require('postcss-message-helpers');
var transformStrip = require('./lib/transformStrip');

module.exports = postcss.plugin('postcss-strip', function () {
    return function (css) {
        function transformValue(node, property) {
            var value = node[property];

            if (!value || value.indexOf('strip(') === -1) {
                return;
            }

            helpers.try(function transformStripValue () {
                node[property] = transformStrip(value);
            }, node.source);
        }

        css.eachInside(function (node) {
            if (node.type === 'atrule') {
                return transformValue(node, 'params');
            } else if (node.type === 'decl') {
                return transformValue(node, 'value');
            }
        });
    };
});
