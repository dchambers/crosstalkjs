var jn = require('jasmine-node');
var karmaServer = require('karma').server;
var path = require('path');

function exitOnFail() {
	if(global.jasmineResult.fail) {
		process.exit(-1);
	}
}

console.log('Spec Tests:');
jn.run({specFolders:['./spec'], captureExceptions:true, onComplete:function() {
	exitOnFail();
	console.log('');
	console.log('Browser Tests:');

	setTimeout(function() {
		karmaServer.start({configFile: path.resolve('karma-conf.js'), singleRun:true, browsers:['Firefox', 'Chrome_Travis_ES6']}, function(exitCode) {
			console.log('Karma has exited with ' + exitCode);
			process.exit(exitCode);
		});
	}, 0);
}});

