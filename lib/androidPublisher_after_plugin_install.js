module.exports = function(context) {
   var child = require('child_process');
   child.exec('npm install', { cwd: '/home/james/ionic-test/test-blank/plugins/com.github.linagee.cordova.androidpublisher' });
}
