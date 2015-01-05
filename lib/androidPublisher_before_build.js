module.exports = function(context) {
  console.log("----------------");
  console.log("INSIDE androidPublisher_before_build.js!!!!");
  console.log(context.cordova.info());
  console.log("----------------");
}
