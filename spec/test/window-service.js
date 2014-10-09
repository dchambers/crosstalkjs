function MockWindow() {
}

MockWindow.prototype.postMessage = function(message, targetOrigin, transfer) {
};

MockWindow.prototype.addEventListener = function(type, listener, useCapture) {
};

var global = (function() {return this})();
var window = (global.postMessage) ? global : new MockWindow();

module.exports = {window:window};

