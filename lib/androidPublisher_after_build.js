var projectRoot = function() {
    var path = require('path');
    var cordova_lib_dir = path.dirname(require.resolve('cordova-lib')); //Find where cordova-lib npm module lives
    var cordova_util = require(path.join(cordova_lib_dir,'src/cordova/util')); //Use util.js from cordova-lib npm module
    var projectRoot = cordova_util.cdProjectRoot();
    return projectRoot;
};
var packageName = function() {
    //returns android package name such as com.ionicframework.testblank463792
    var path = require('path');
    var androidXml = path.join(projectRoot(), 'platforms', 'android');
    var cordova_lib_dir = path.dirname(require.resolve('cordova-lib')); //Find where cordova-lib npm module lives
    var platforms = require(path.join(cordova_lib_dir, 'src/plugman/platforms'));
    var package_name = platforms.android.package_name(androidXml);
    console.log("Found package name: " + package_name);
    return package_name;
};
var inspectFile = function(contents) {
    return contents.indexOf('"private_key": "-----BEGIN PRIVATE KEY-----') != -1;
};
var jsonApiKey = function() {
    //find a json Google API key
    var fs = require('fs');
    var path = require('path');
    var fullPath = path.join(require('homedir')(),'/.androidKeys');
    var files = fs.readdirSync(fullPath);
    var files2 = [];
    for (var x = 0; x < files.length; x++) {
        if (files[x].substr(-5) === '.json') {
            files2.push(files[x]);
        }
    }
    if (files2.length != 1) {
        console.log('Found ' + files2.length + ' directories, fatal. There should only be one .json file in ~/.androidKeys (Please make sure you follow the directions at https://github.com/linagee/cordova-androidpublisher )');
        process.exit(1);
    }
    var apiKeyFile = path.join(fullPath, files2[0]);
    console.log('Found API key: ' + apiKeyFile);
    return JSON.parse(fs.readFileSync(apiKeyFile));
};
var findApk = function() {
    //find where the built .apk release file is and return the full path
    var fs = require('fs');
    var path = require('path');
    var fullPath = path.join(projectRoot(),'/platforms/android/ant-build');
    var files = fs.readdirSync(fullPath);
    var files2 = [];
    for (var x = 0; x < files.length; x++) {
        if (files[x].substr(-12) === '-release.apk') {
            files2.push(files[x]);
        }
    }
    if (files2.length != 1) {
        console.log('Found ' + files2.length + ' files, fatal. There should only be one -release.apk file in projectRoot/platforms/android/ant-build (Perhaps you didn\'t follow the build instructions on https://github.com/linagee/cordova-androidpublisher ?)');
        process.exit(1);
    }
    var apkFile = path.join(fullPath, files2[0]);
    console.log('Found release APK: ' + apkFile);
    return apkFile;
};
module.exports = function(context) {
  //Find the option --publish either in the options array or command line string
  // (If not, androidPublisher ignores this build request.)
  if ((context.opts.options
    && Object.prototype.toString.call( context.opts.options ) === '[object Array]'
    && context.opts.options.indexOf("--publish") != -1)
    || (context.cmdLine
      && context.cmdLine.indexOf(" --publish") != -1)) {
        console.log("Found project root: " + projectRoot());
        var fs = require('fs');
        //find the build APK file
        var apkFile = findApk();
        //find package name
        var package = packageName();
        //find json API key
        var apiKey = jsonApiKey();
        //push up APK to Google Play
        var google = require('googleapis');
        var jwt = new google.auth.JWT(
           apiKey.client_email,
           null,
           apiKey.private_key,
           'https://www.googleapis.com/auth/androidpublisher', //scope
           null
        );
        var editId;
        jwt.authorize(function() {
           google.options({ auth: jwt }); // set auth as a global default
           var androidpublisher = google.androidpublisher('v2');
           console.log('Attempting to verify ' + package + ' exists on Google Developer Console...');
           androidpublisher.edits.insert({ packageName: package }, function(err, resp) {
              if (err) {
                 console.log(err);
                 return;
              } else {
                  console.log('Found your project on Google Play Developer Console!');
                  editId = resp.id;
                  var fileContents = fs.readFileSync(apkFile);
                  var fileSize = require('prettysize')(fileContents.length, true, false);
                  console.log('Starting upload, this may take a while... (' + fileSize + ')');
                  androidpublisher.edits.apks.upload({
                      editId: editId,
                      packageName: package,
                      media: { mimeType: 'application/vnd.android.package-archive', body: fileContents }
                  },
                  function(err, resp) {
                    if (err) {
                       console.log(err);
                       return;
                    } else {
                        console.log('Upload complete!');
                        androidpublisher.edits.tracks.update({ editId: editId, track: 'alpha', packageName: package }, function (err, resp) {
                            if (err) {
                               console.log(err);
                               return;
                            } else {
                                console.log("Set to be under alpha");
                                androidpublisher.edits.commit({ editId: editId, packageName: package }, function (err, resp) {
                                    if (err) {
                                       console.log(err);
                                       return;
                                    } else {
                                        console.log("Successfully committed changes! APK is ready on Google Play Developer Console!");
                                        console.log("Load up https://play.google.com/apps/publish to verify");
                                    }
                                });
                            }
                        })
                    }
                  });
              }
           });
        });
 //
  }
}
