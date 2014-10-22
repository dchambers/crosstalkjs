var crosstalk = require('../../lib/crosstalk');
var ws = require('./window-service');
var should = require('chai').should();

describe('crosstalk.createRegistry()', function() {
	it('requires a target argument to be provided', function() {
		(function() {
			crosstalk.createRegistry();
		}).should.throw('target argument must be provided');
	});

	it('only allows registries to be created on windows, frames, iframes and web-workers', function() {
		(function() {
			crosstalk.createRegistry({}, ['*']);
		}).should.throw('target argument must fulfill Postable');
	});

	it('requires a list of acceptable origins to be provided', function() {
		(function() {
			crosstalk.createRegistry(ws.window);
		}).should.throw('validOrigins argument must be provided');
	});

	it('requires a list of acceptable origins to be provided', function() {
		(function() {
			crosstalk.createRegistry(ws.window, '*');
		}).should.throw('validOrigins argument must be a Array');
	});

	it('requires the list of acceptable origins to be non-empty', function() {
		(function() {
			crosstalk.createRegistry(ws.window, []);
		}).should.throw('validOrigins argument must be a non-empty array');
	});

	it('returns a registry object if valid arguments are provided', function() {
		should.exist(crosstalk.createRegistry(ws.window, ['*']));
	});
});
