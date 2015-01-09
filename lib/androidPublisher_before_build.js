module.exports = function(context) {
  //Find the option --publish either in the options array or command line string
  // (If not, androidPublisher ignores this build request.)
  if (context &&
      context.cmdLine &&
      context.cmdLine.indexOf(" --publish") !== -1) {
        //Don't do anything for the before_build for now.
        //
        //Future features/validation: make sure --release is enabled (Play Store doesn't like debug APK),
        // make sure the signing key is in place (ant.properties), make sure the package name exists
        // on the Google Play store before doing anything
  }
};
