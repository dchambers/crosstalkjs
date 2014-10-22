var topiarist = require('topiarist');
var Postable = require('./Postable');
var using = require('typester').using;

function CrossTalkRegistry(target, validOrigins) {
	using(arguments)
		.verify('target').fulfills(Postable)
		.verify('validOrigins').nonEmptyArray();

	this.services = [];
	this.validOrigins = validOrigins;
	target.addEventListener('message', onMessageReceived.bind(this), false);
}

CrossTalkRegistry.prototype.registerService = function(serviceName, service) {
	using(arguments)
		.verify('serviceName').nonEmptyString()
		.verify('service').isA(Object);

	// TODO: get rid of this line once we've added an `object()` verifier to typester
	if(typeof(service) != 'object') throw new TypeError('service argument must be an object');

	if(serviceName in this.services) throw new Error("A service with the name '" + serviceName + "' has already been registered");

	this.services[serviceName] = service;
};

function onMessageReceived(event) {
	if(!(event.origin in this.validOrigins)) {
		console.warn("message received from '" + event.origin + "' ignored as the valid origins are: '" + this.validOrigins.join("', '") + "'");
	}
	else {
		if(event.data.type != 'get-registry-info') {
			console.warn("message of type '" + event.data.type + "' received from '" + event.data.origin +
				"' ignored as the only supported messaged types are: 'get-registry-info'");
		}
		else {
			event.source.postMessage(getRegistryInfo(this.services), event.origin);
		}
	}
}

function getRegistryInfo(services) {
	var registryInfo = {};

	for(serviceName in services) {
		var service = services[serviceName];
		registryInfo[serviceName] = Object.keys(service).filter(function(key) {return typeof(service[key]) == 'function'});
	}

	return registryInfo;
}

module.exports = CrossTalkRegistry;
