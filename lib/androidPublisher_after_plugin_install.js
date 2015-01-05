module.exports = function(context) {
   //Check to see if Google API npm is installed
   try {
      console.log(require.resolve("googleapis"));
   } catch(e) {
      console.log(e);
      console.error("Mocha is not found");
      process.exit(e.code);
   }
   console.log(context);
   console.log("After Plugin Install");
}
