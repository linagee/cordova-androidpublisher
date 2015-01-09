var fs = require('fs');
var async = require('async');
var path = require('path');
var homedir = require('homedir');
var google = require('googleapis');
var prettysize = require('prettysize');
var sha1 = require('sha1');

var projectRoot = function() {
    var cordovaLibDir = path.dirname(require.resolve('cordova-lib')); //Find where cordova-lib npm module lives
    var cordovaUtil = require(path.join(cordovaLibDir,'src/cordova/util')); //Use util.js from cordova-lib npm module
    return cordovaUtil.cdProjectRoot();
};
var packageName = function(root) {
    //returns android package name such as com.ionicframework.testblank4637
    var androidXml = path.join(root, 'platforms', 'android');
    var cordovaLibDir = path.dirname(require.resolve('cordova-lib')); //Find where cordova-lib npm module lives
    var platforms = require(path.join(cordovaLibDir, 'src/plugman/platforms'));
    return platforms.android.package_name(androidXml);
};
var inspectFile = function(contents) {
    return contents.indexOf('"private_key": "-----BEGIN PRIVATE KEY-----') !== -1;
};
var jsonApiKey = function() {
    //find a json Google API key
    var fullPath = path.join(homedir(),'/.androidKeys');
    var files = fs.readdirSync(fullPath);
    var files2 = [];
    for (var x = 0; x < files.length; x++) {
        if (files[x].substr(-5) === '.json') {
            files2.push(files[x]);
        }
    }
    if (files2.length !== 1) {
        console.log('Found ' + files2.length + ' files, fatal. There should only be one .json file in ~/.androidKeys (Please make sure you follow the directions at https://github.com/linagee/cordova-androidpublisher )');
        process.exit(1);
    }
    var apiKeyFile = path.join(fullPath, files2[0]);
    console.log('Found API key: ' + apiKeyFile);
    return JSON.parse(fs.readFileSync(apiKeyFile));
};
var findApk = function(root) {
    //find where the built .apk release file is and return the full path
    var fullPath = path.join(root,'/platforms/android/ant-build');
    var files = fs.readdirSync(fullPath);
    var files2 = [];
    for (var x = 0; x < files.length; x++) {
        if (files[x].substr(-12) === '-release.apk') {
            files2.push(files[x]);
        }
    }
    if (files2.length !== 1) {
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
  if (context &&
      context.cmdLine &&
      context.cmdLine.indexOf(" --publish") !== -1) {
     var root = projectRoot();
     console.log("Found project root: " + root);
     var fileContents = fs.readFileSync(findApk(root)); //find and get contents of APK
     var package = packageName(root); //find package name
     console.log("Found package name: " + package);
     var apiKey = jsonApiKey(); //find json API key
     var jwt = new google.auth.JWT(
        apiKey.client_email,
        null,
        apiKey.private_key,
        'https://www.googleapis.com/auth/androidpublisher', //scope
        null
     );
     var androidpublisher = google.androidpublisher('v2');
     var editId;
     var versionCode;
     async.waterfall([
        function(callback) {
           jwt.authorize(function(err, resp) { callback(null, err, resp); });
        },
        function(err, resp, callback) {
           if (err) {
              console.log(err);
              process.exit(1);
           } else {
              google.options({ auth: jwt }); // set auth as a global default
              console.log('Attempting to verify ' + package + ' exists on Google Developer Console...');
              androidpublisher.edits.insert({  //check if package exists
                 packageName: package
              }, function(err, resp) { callback(null, err, resp); });
           }
        },
        function(err, resp, callback) {
//           console.log("androidpublisher.edits.insert response:");
//           console.log(resp);
           if (err) {
              console.log(err);
              process.exit(1);
           } else {
              console.log('Found your package ' + package + ' on Google Play Developer Console!');
              editId = resp.id;
              var fileSize = prettysize(fileContents.length, true, false);
              console.log('Starting upload, this may take a while... (' + fileSize + ')');
              androidpublisher.edits.apks.upload({  //upload file
                editId: editId,
                packageName: package,
                media: { mimeType: 'application/vnd.android.package-archive', body: fileContents }
              }, function(err, resp) { callback(null, err, resp); });
           }
        },
        function(err, resp, callback) {
//           console.log("androidpublisher.edits.apks.upload response:");
//           console.log(resp);
           if (err) {
              console.log(err);
              process.exit(1);
           } else {
              versionCode = resp.versionCode;
              console.log('Upload complete! (Version code: ' + versionCode + ')');
              var googleSha = resp.binary.sha1;
              var ourSha = sha1(fileContents);
              console.log("Google has sha1sum: " + googleSha);
              console.log("Our file sha1sum: " + ourSha);
              if (googleSha === ourSha) {
                 console.log("sha1sums matched!");
              } else {
                 console.log("sha1sums didn't match, aborting!");
                 process.exit(1);
              }
              androidpublisher.edits.tracks.update({  // sets track of APK to Alpha
                 editId: editId,
                 track: 'alpha',
                 packageName: package,
                 versionCodes: [versionCode]
              }, function(err, resp) { callback(null, err, resp); });
           }
        },
        function(err, resp, callback) {
//           console.log("androidpublisher.edits.tracks.update response:");
//           console.log(resp);
           if (err) {
              console.log(err);
              process.exit(1);
           } else {
              console.log("Set to be under alpha (attempting commit of this edit)");
              androidpublisher.edits.commit({
                 editId: editId,
                 packageName: package
              }, function(err, resp) { callback(null, err, resp); });
           }
        },
        function(err, resp, callback) {
//           console.log("androidpublisher.edits.commit response:");
//           console.log(resp);
           if (err) {
              console.log(err);
              process.exit(1);
           } else {
              console.log("Successfully committed changes! APK is ready on Google Play Developer Console!");
              console.log("Load up https://play.google.com/apps/publish/#ApkPlace:p=" + package + " to verify");
              console.log("Per Google: 'As with all edits, it can take several hours for the changes to take effect.'");
           }
        }
     ]);
  }
};
