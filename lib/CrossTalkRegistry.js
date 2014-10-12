var topiarist = require('topiarist');
var Postable = require('./Postable');

function CrossTalkRegistry(target, validOrigins) {
	if(target === undefined) throw new Error('target argument must be provided');
	if(!topiarist.fulfills(target, Postable)) throw new TypeError('target argument must be a window, frame, iframe or web-worker');
	if(validOrigins === undefined) throw new Error('validOrigins argument must be provided');
	if(!(validOrigins instanceof Array)) throw new TypeError('validOrigins argument must be a list');
	if(validOrigins.length == 0) throw new Error('the validOrigins list must contain at least one item');

	this.services = [];
	this.validOrigins = validOrigins;
	target.addEventListener('message', onMessageReceived.bind(this), false);
}

CrossTalkRegistry.prototype.registerService = function(serviceName, service) {
	if(serviceName === undefined) throw new Error('serviceName argument must be provided');
	if(typeof(serviceName) != 'string') throw new TypeError('serviceName argument must be a string');
	if(serviceName in this.services) throw new Error("A service with the name '" + serviceName + "' has already been registered");
	if(service === undefined) throw new Error('service argument must be provided');
	if(typeof(service) != 'object') throw new TypeError('service argument must be an object');

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

