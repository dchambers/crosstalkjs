var build = require('dchambers-lib-build-tool');

Promise.resolve().then(function() {
  return build.mochaTest('Spec Tests', ['spec/test/tests.spec.js']);
}).then(function() {
  // TODO: re-enable testing in Firefox once Travis upgrades past Firefox 31 -- FF 32 and FF 33 both work for me
  // return build.karmaTest('Browser Tests', ['dist/crosstalk-spec-tests.js'], ['Firefox', 'Chrome_Travis_ES6']);
  return build.karmaTest('Browser Tests', ['dist/crosstalk-spec-tests.js'], ['Chrome_Travis_ES6']);
}).catch(function(exitCode) {
  console.log('Exiting with status ' + exitCode);
  process.exit(exitCode);
});
