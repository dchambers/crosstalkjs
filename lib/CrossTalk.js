var CrossTalkRegistry = require('./CrossTalkRegistry');
var RemoteCrossTalkRegistry = require('./RemoteCrossTalkRegistry');

function CrossTalk() {
}

CrossTalk.prototype.createRegistry = function(target, validOrigins) {
	return new CrossTalkRegistry(target, validOrigins);
};

CrossTalk.prototype.accessRegistry = function(target, origin) {
	return new RemoteCrossTalkRegistry(target, origin);
};

module.exports = CrossTalk;

