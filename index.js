var postcss = require('postcss');
var helpers = require('postcss-message-helpers');
var transformStrip = require('./lib/transformStrip');

module.exports = postcss.plugin('postcss-strip', function () {
    return function (css) {
        css.eachDecl(function transformDecl (decl) {
            if (!decl.value || decl.value.indexOf('strip(') === -1) {
                return;
            }
            decl.value = helpers.try(function transformStripValue () {
                return transformStrip(decl.value);
            }, decl.source);
        });
    };
});
