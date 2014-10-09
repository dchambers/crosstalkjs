var crosstalk = require('../../lib/crosstalk');
var ws = require('./window-service');

describe('registry.registerService()', function() {
	var registry;

	beforeEach(function() {
		registry = crosstalk.createRegistry(ws.window, ['*']);
	});

	it('requires a serviceName argument', function() {
		expect(function() {
			registry.registerService();
		}).toThrow(Error('serviceName argument must be provided'));
	});

	it('requires the serviceName argument to be a string', function() {
		expect(function() {
			registry.registerService(42, {});
		}).toThrow(TypeError('serviceName argument must be a string'));
	});

	it('requires a service argument to be provided', function() {
		expect(function() {
			registry.registerService('my-service');
		}).toThrow(Error('service argument must be provided'));
	});

	it('requires the service argument to be an object', function() {
		expect(function() {
			registry.registerService('my-service', function() {});
		}).toThrow(TypeError('service argument must be an object'));
	});

	it('requires the serviceName argument to be a unique identifier', function() {
		registry.registerService('my-service', {});

		expect(function() {
			registry.registerService('my-service', {});
		}).toThrow(Error("A service with the name 'my-service' has already been registered"));
	});
});

