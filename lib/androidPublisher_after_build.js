var package_name = function() {
    //returns android package name such as com.ionicframework.testblank463792
    var path = require('path');
    var cordova_lib_dir = path.dirname(require.resolve('cordova-lib')); //Find where cordova-lib npm module lives
    var cordova_util = require(path.join(cordova_lib_dir,'src/cordova/util')); //Use util.js from cordova-lib npm module
    var projectRoot = cordova_util.cdProjectRoot();
    var androidXml = path.join(projectRoot, 'platforms', 'android');
    var platforms = require(path.join(cordova_lib_dir, 'src/plugman/platforms'));
    return platforms.android.package_name(androidXml);
};
module.exports = function(context) {
  //Find the option --publish either in the options array or command line string
  // (If not, androidPublisher ignores this build request.)
  if ((context.opts.options
    && Object.prototype.toString.call( context.opts.options ) === '[object Array]'
    && context.opts.options.indexOf("--publish") != -1)
    || (context.cmdLine
      && context.cmdLine.indexOf(" --publish") != -1)) {
        //console.log("----------------");
        //console.log("INSIDE androidPublisher_after_build.js!!!!");
        //console.log(context.opts.options);
        //console.log("----------------");

        //push up APK to Google Play
//        console.log(context);

        console.log(package_name());

//        var configPath = cordova_util.projectConfig(projectRoot);
//
//        var cordova_lib = require('cordova-lib');
//        console.log(cordova_lib.plugman.platform({ operation: '', platform_name: 'android' }));
//        var ConfigParser = cordova_lib.configparser;
//        var configXml = new ConfigParser(configPath);
//        console.log("configXml: ");
//        console.log(configXml);

  }
}
