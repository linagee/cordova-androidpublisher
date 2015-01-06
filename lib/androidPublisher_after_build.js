var packageName = function() {
    //returns android package name such as com.ionicframework.testblank463792
    var path = require('path');
    var cordova_lib_dir = path.dirname(require.resolve('cordova-lib')); //Find where cordova-lib npm module lives
    var cordova_util = require(path.join(cordova_lib_dir,'src/cordova/util')); //Use util.js from cordova-lib npm module
    var projectRoot = cordova_util.cdProjectRoot();
    console.log("Found project root: " + projectRoot);
    var androidXml = path.join(projectRoot, 'platforms', 'android');
    var platforms = require(path.join(cordova_lib_dir, 'src/plugman/platforms'));
    var package_name = platforms.android.package_name(androidXml);
    console.log("Found package name: " + package_name);
};
module.exports = function(context) {
  //Find the option --publish either in the options array or command line string
  // (If not, androidPublisher ignores this build request.)
  if ((context.opts.options
    && Object.prototype.toString.call( context.opts.options ) === '[object Array]'
    && context.opts.options.indexOf("--publish") != -1)
    || (context.cmdLine
      && context.cmdLine.indexOf(" --publish") != -1)) {
        //find package name
        var package = packageName();
        //push up APK to Google Play
  }
}
