var helpers = require('postcss-message-helpers');
var transformStrip = require('./transformStrip');
module.exports = function strip (css) {
    css.eachDecl(function transformDecl (decl) {
        if (!decl.value || decl.value.indexOf('strip(') === -1) {
            return;
        }
        decl.value = helpers.try(function transformStripValue () {
            return transformStrip(decl.value);
        }, decl.source);
    });
};
