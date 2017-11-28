/*eslint max-len:0 */
var postcss = require('postcss');
var expect  = require('chai').expect;

var test = function (input, output, opts, done) {
    var plugins = [
        require('postcss-custom-properties'),
        require('../')(opts.pluginOptions),
        require('postcss-calc'),
        require('postcss-reporter')({ clearReportedMessages : false })
    ];
    var processOptions = { from : 'inline string' };

    postcss(plugins).process(input, processOptions).then(function (result) {
        expect(result.css).to.eql(output);
        if (opts.numberOfWarnings === undefined) {
            expect(result.warnings()).to.be.empty;
        } else {
            expect(result.warnings().length).to.equal(opts.numberOfWarnings);
        }
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

    it('should strip a value from a media query', function (done) {
        test('@media (width: strip(1px)) {}', '@media (width: 1) {}', {}, done);
    });

    it('should result in NaN and leave original value as a result', function (done) {
        test('@media (width: strip(a1px)) {}', '@media (width: a1px) {}', {numberOfWarnings : 1}, done);
    });

    it('nested strips', function (done) {
        test('@media (width: strip(strip(1px))) {}', '@media (width: 1) {}', {}, done);
    });

    it('nested strips with odd whitespace', function (done) {
        test('@media (width: strip( strip(1px   ))) {}', '@media (width: 1) {}', {}, done);
    });

    it('test functionName option', function (done) {
        test('@media (width: removeUnit(1px   )) {}', '@media (width: 1) {}', {pluginOptions : {functionName : 'removeUnit'}}, done);
    });

});
