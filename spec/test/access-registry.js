var crosstalk = require('../../lib/crosstalk');
var ws = require('./window-service');

describe('crosstalk.accessRegistry()', function() {
	it('requires a target argument', function() {
		expect(function() {
			crosstalk.accessRegistry();
		}).toThrow(Error('target argument must be provided'));
	});

	it('only allows registries to be accessed on windows, frames, iframes and web-workers', function() {
		expect(function() {
			crosstalk.accessRegistry({}, '*');
		}).toThrow(TypeError('target argument must be a window, frame, iframe or web-worker'));
	});

	it('requires a targetOrigin argument', function() {
		expect(function() {
			crosstalk.accessRegistry(ws.window);
		}).toThrow(Error('targetOrigin argument must be provided'));
	});

	it('requires the targetOrigin argument to be a string', function() {
		expect(function() {
			crosstalk.accessRegistry(ws.window, true);
		}).toThrow(TypeError('targetOrigin argument must be a string'));
	});

	it('returns a remote registry object if valid arguments are provided', function() {
		expect(crosstalk.accessRegistry(ws.window, '*')).toBeDefined();
	});
});

