/*eslint max-len:0 */
var postcss = require('postcss');
var expect  = require('chai').expect;

var test = function (input, output, opts, done) {
    postcss([
        require('postcss-custom-properties'),
        require('../'),
        require('postcss-calc')
    ]).process(input).then(function (result) {
        expect(result.css).to.eql(output);
        expect(result.warnings()).to.be.empty;
        done();
    }).catch(function (error) {
        done(error);
    });
};

describe('postcss-strip', function () {

    it('should strip a value', function (done) {
        test('a{test: strip(1em);}', 'a{test: 1;}', {}, done);
    });

    it('should work multiple times on one value', function (done) {
        test('a{test: strip(1em) strip(2px) strip(3vw) strip(4);}', 'a{test: 1 2 3 4;}', {}, done);
    });

    it('should evaluate variables', function (done) {
        test(':root{--foo: 1em;}a{test: var(--foo);}', 'a{test: 1em;}', {}, done);
    });

    it('should evaluate `calc()`', function (done) {
        test('a{test: calc(3 * 2);}', 'a{test: 6;}', {}, done);
    });

    it('should chain `calc()` and variables', function (done) {
        test(':root{--bar: 2em;}a{test: calc(strip(var(--bar)) * 12px);}', 'a{test: 24px;}', {}, done);
    });

});
