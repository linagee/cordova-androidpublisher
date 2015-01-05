module.exports = function(context) {
   //Check to see if Google API npm is installed. If not, try installing.
   try {
      console.log(require.resolve("googleapis"));
   } catch(e) {
      if (e.code == 'MODULE_NOT_FOUND') {
         //install it
         exec('npm install');
         //var npm = require("npm");
         //npm.load(function (er) {
         //  if (er) { return handlError(er); }
         //  npm.commands.install(["googleapis"], function (er, data) {
         //     if (er) { return commandFailed(er); }
         //     // command succeeded, and data might have some info
         //     console.log("Command succeeded");
         //  })
         //  //npm.registry.log.on("log", function (message) { ....; })
         //});
      } else {
         console.log(e);
         process.exit(e.code);
      }
   }
   console.log(context);
   console.log("After Plugin Install");
}
