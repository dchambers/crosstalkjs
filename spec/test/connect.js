var crosstalk = require('../../lib/crosstalk');
var ws = require('./window-service');

describe('remoteRegistry.connect()', function() {
	// TODO: replace the window-service with `MockPostableWindow` and `MockPostableWorker` objects that simulate the browser, and let me test origin failures properly

	it('should sucesfully connect if there is a registry on the other side', function() {
		var registry = crosstalk.createRegistry(ws.window, ['*']);
		var remoteRegistry = crosstalk.accessRegistry(ws.window, '*');

		remoteRegistry.connect().then(function() {
			// TODO...
		}, function() {
			// TODO...
		})

//		expect(function() {
//		}).toThrow(Error('window argument must be provided'));
	});
});

