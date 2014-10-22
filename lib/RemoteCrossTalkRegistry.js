var SecureChannel = require('./SecureChannel');

/* Test TODO:
 * test that more than one registry accessor can connect to the same service, and there will be no confusion about how the messages are routed
 * test that message from other domains are ignored
 * test that a domain we have chosen to use a service from, can't send us messages for a service proxy that is connected to a different domain.
 * test all the exceptions we throw in serviceProxy()
 */

function RemoteCrossTalkRegistry(target, targetOrigin) {
	this.secureChannel = new SecureChannel(target, targetOrigin);
}

RemoteCrossTalkRegistry.prototype.connect = function() {
	return this.secureChannel.sendMessage({type:'get-registry-info'}, function(data) {
		this.registryInfo = data.registryInfo;
	});
};

RemoteCrossTalkRegistry.prototype.serviceProxy = function(serviceName, protocol) {
	// TODO: unit test this using() block
	using(arguments)
		.verify('serviceName').nonEmptyString()
		.verify('protocol').optionally.isA(Function);

	var serviceInfo = this.registryInfo.services[sericeName];
	if(serviceInfo === undefined) throw new Error("The '" + serviceName + "' service has not been registered at the remote end.");
	if(protocol && !topiarist.fulfills(serviceInfo, protocol)) throw new Error("The '" + serviceName + "' service has not fulfill the provided protocol.");

	var ObjectProxy = new Function();
	if(protocol) {
		ObjectProxy.prototype = Object.create(protocol.prototype);
		ObjectProxy.prototype.constructor = ObjectProxy;
	}
	var objectProxy = new ObjectProxy();
	decorateObjectProxy(objectProxy, serviceName, serviceInfo, this.secureChannel.spawn());

	return objectProxy;
};

function decorateObjectProxy(objectProxy, serviceName, serviceInfo, secureChannel) {
	for(var methodName in Object.keys(serviceInfo)) {
		objectProxy[methodName] = objectProxyMethod(secureChannel, serviceName, methodName);
	}
}

function objectProxyMethod(secureChannel, serviceName, methodName) {
	return function() {
		return secureChannel.sendMessage({type:'service-method-invocation', serviceName:serviceName, methodName:methodName, arguments:arguments});
	};
}

module.exports = RemoteCrossTalkRegistry;
