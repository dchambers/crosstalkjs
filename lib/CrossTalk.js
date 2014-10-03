var CrossTalkRegistry = require('./CrossTalkRegistry');

function CrossTalk() {
}

CrossTalk.prototype.createRegistry = function(target, validOrigins) {
	return new CrossTalkRegistry(target, validOrigins);
};

module.exports = CrossTalk;

