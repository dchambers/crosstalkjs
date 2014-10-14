var crosstalk = require('../../lib/crosstalk');
var ws = require('./window-service');
var should = require('chai').should();

describe('registry.registerService()', function() {
	var registry;

	beforeEach(function() {
		registry = crosstalk.createRegistry(ws.window, ['*']);
	});

	it('requires a serviceName argument', function() {
		(function() {
			registry.registerService();
		}).should.throw('serviceName argument must be provided');
	});

	it('requires the serviceName argument to be a string', function() {
		(function() {
			registry.registerService(42, {});
		}).should.throw('serviceName argument must be a string');
	});

	it('requires a service argument to be provided', function() {
		(function() {
			registry.registerService('my-service');
		}).should.throw('service argument must be provided');
	});

	it('requires the service argument to be an object', function() {
		(function() {
			registry.registerService('my-service', function() {});
		}).should.throw('service argument must be an object');
	});

	it('requires the serviceName argument to be a unique identifier', function() {
		registry.registerService('my-service', {});

		(function() {
			registry.registerService('my-service', {});
		}).should.throw("A service with the name 'my-service' has already been registered");
	});
});
