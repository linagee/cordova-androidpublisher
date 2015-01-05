module.exports = function(context) {
  if (context.opts.options
       && Object.prototype.toString.call( context.opts.options ) === '[object Array]'
       && context.opts.options.indexOf("--publish") != -1) {
        console.log("----------------");
        console.log("INSIDE androidPublisher_before_build.js!!!!");
        console.log(context.opts.options);
        console.log("----------------");
  }
}
