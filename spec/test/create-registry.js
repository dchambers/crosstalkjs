var crosstalk = require('../../lib/crosstalk');
var ws = require('./window-service');

describe('crosstalk.createRegistry()', function() {
	it('requires a target argument to be provided', function() {
		expect(function() {
			crosstalk.createRegistry();
		}).toThrow(Error('target argument must be provided'));
	});

	it('only allows registries to be created on windows, frames, iframes and web-workers', function() {
		expect(function() {
			crosstalk.createRegistry({}, ['*']);
		}).toThrow(TypeError('target argument must be a window, frame, iframe or web-worker'));
	});

	it('requires a list of acceptable origins to be provided', function() {
		expect(function() {
			crosstalk.createRegistry(ws.window);
		}).toThrow(Error('validOrigins argument must be provided'));
	});

	it('requires a list of acceptable origins to be provided', function() {
		expect(function() {
			crosstalk.createRegistry(ws.window, '*');
		}).toThrow(TypeError('validOrigins argument must be a list'));
	});

	it('requires the list of acceptable origins to be non-empty', function() {
		expect(function() {
			crosstalk.createRegistry(ws.window, []);
		}).toThrow(Error('the validOrigins list must contain at least one item'));
	});

	it('returns a registry object if valid arguments are provided', function() {
		expect(crosstalk.createRegistry(ws.window, ['*'])).toBeDefined();
	});
});

