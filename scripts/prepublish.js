var build = require('dchambers-lib-build-tool');

build.bundleDeps(
	build.bundle('crosstalk.js', ['./lib/global-crosstalk.js']),
	build.bundle('crosstalk-spec-tests.js', ['./spec/test/tests.spec.js'])
);
