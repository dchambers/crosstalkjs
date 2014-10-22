var crosstalk = require('../../lib/crosstalk');
var ws = require('./window-service');
var should = require('chai').should();

describe('crosstalk.accessRegistry()', function() {
	it('requires a target argument', function() {
		(function() {
			crosstalk.accessRegistry();
		}).should.throw('target argument must be provided');
	});

	it('only allows registries to be accessed on windows, frames, iframes and web-workers', function() {
		(function() {
			crosstalk.accessRegistry({}, '*');
		}).should.throw('target argument must fulfill Postable');
	});

	it('requires a targetOrigin argument', function() {
		(function() {
			crosstalk.accessRegistry(ws.window);
		}).should.throw('targetOrigin argument must be provided');
	});

	it('requires the targetOrigin argument to be a string', function() {
		(function() {
			crosstalk.accessRegistry(ws.window, true);
		}).should.throw('targetOrigin argument must be a String');
	});

	it('returns a remote registry object if valid arguments are provided', function() {
		should.exist(crosstalk.accessRegistry(ws.window, '*'));
	});
});
