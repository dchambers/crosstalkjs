var fs = require('fs');
var mkdirp = require('mkdirp');
var browserify = require('browserify');

mkdirp('dist/mocha', function(err) {
	if(err) {
		console.error(err);
	}
	else {
		createBundle('dist/crosstalk.js', ['./lib/global-crosstalk.js']);
		createBundle('dist/crosstalk-spec-tests.js', ['./spec/test/tests.spec.js']);

		fs.createReadStream('node_modules/mocha/mocha.js').pipe(fs.createWriteStream('dist/mocha/mocha.js'));
		fs.createReadStream('node_modules/mocha/mocha.css').pipe(fs.createWriteStream('dist/mocha/mocha.css'));
	}
});

function createBundle(outputFilePath, inputFilePaths) {
	var b = browserify();
	for(var key in inputFilePaths) {
		b.add(inputFilePaths[key]);
	}
	
	b.bundle().pipe(fs.createWriteStream(outputFilePath));
}
