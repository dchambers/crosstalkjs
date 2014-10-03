var topiarist = require('topiarist');
var Postable = require('./Postable');
var services = [];

function CrossTalkRegistry(target, validOrigins) {
	if(target === undefined) throw new Error('target argument must be provided');
	if(!topiarist.fulfills(target, Postable)) throw new TypeError('target argument must be a window, frame, iframe or web-worker');
	if(validOrigins === undefined) throw new Error('validOrigins argument must be provided');
	if(!(validOrigins instanceof Array)) throw new TypeError('validOrigins argument must be a list');
	if(validOrigins.length == 0) throw new Error('the validOrigins list must contain at least one item');

	target.addEventListener('message', onMessageReceived.bind(this), false);
}

CrossTalkRegistry.prototype.registerService = function(serviceName, service) {
	if(serviceName === undefined) throw new Error('serviceName argument must be provided');
	if(typeof(serviceName) != 'string') throw new TypeError('serviceName argument must be a string');
	if(serviceName in services) throw new Error("A service with the name '" + serviceName + "' has already been registered");
	if(service === undefined) throw new Error('service argument must be provided');
	if(typeof(service) != 'object') throw new TypeError('service argument must be an object');

	services[serviceName] = service;
};

function onMessageReceived(event) {
	// TODO...
}

module.exports = CrossTalkRegistry;

