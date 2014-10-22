var secureRandom = require('secure-random');
var topiarist = require('topiarist');
var Postable = require('./Postable');
var using = require('typester').using;

function SecureChannel(target, targetOrigin) {
	using(arguments)
		.verify('target').fulfills(Postable)
		.verify('targetOrigin').nonEmptyString();

	this.target = target;
	this.targetOrigin = targetOrigin;
	this.senderId = secureRandom(32);

	target.addEventListener('message', this._receiveMessage.bind(this), false);
}

SecureChannel.prototype.spawn = function() {
	return new SecureChannel(this.target, this.targetOrigin);
};

SecureChannel.prototype.sendMessage = function(messageData, callback) {
	if(this.callback) throw new Error('Channel is still awaiting a response from a previous sent message');

	messageData.senderId = this.senderId;

	var promise = new Promise(function(resolve, reject) {
		this.callBack = function(responseData) {
			this.callBack = null;
			callback.call(this, responseData);
			resolve();
		}.bind(this);
		this.target.postMessage(messageData, self.targetOrigin);
	}.bind(this));

	return promise;
};

SecureChannel.prototype._receiveMessage = function(event) {
	if((event.origin == this.targetOrigin) && (event.data.senderId == this.senderId)) {
		this.callBackFunc.call(this, event.data);
	}
};

module.exports = SecureChannel;
