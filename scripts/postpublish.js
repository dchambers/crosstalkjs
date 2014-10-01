var crossTalkJsVersion = require('../package.json').version;

console.log('You now need to run:');
console.log('  git tag -a v' + crossTalkJsVersion + '; git push origin v' + crossTalkJsVersion);
console.log('');
console.log('Download the built artifact here:');
console.log('  <http://registry.npmjs.org/crosstalkjs/-/crosstalkjs-' + crossTalkJsVersion + '.tgz>');
console.log('');
console.log('Then edit the release notes here:');
console.log('  <https://github.com/dchambers/crosstalkjs/releases>');
console.log('');

