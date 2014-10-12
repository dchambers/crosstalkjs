var secureRandom = require('secure-random');
var topiarist = require('topiarist');
var Postable = require('./Postable');

function SecureChannel(target, targetOrigin) {
	if(target === undefined) throw new Error('target argument must be provided');
	if(!topiarist.fulfills(target, Postable)) throw new TypeError('target argument must be a window, frame, iframe or web-worker');
	if(targetOrigin === undefined) throw new Error('targetOrigin argument must be provided');
	if(typeof(targetOrigin) != 'string') throw new TypeError('targetOrigin argument must be a string');

	this.target = target;
	this.targetOrigin = targetOrigin;
	this.senderId = secureRandom(32);

	addEventListener('message', this._receiveMessage.bind(this), false);
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

