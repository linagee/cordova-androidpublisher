module.exports = function(context) {
   //Check to see if Google API npm is installed. If not, try installing.
   try {
      console.log(require.resolve("googleapis"));
   } catch(e) {
      if (e.code == 'MODULE_NOT_FOUND') {
         //install it
         exec('npm install');
      } else {
         console.log(e);
         process.exit(e.code);
      }
   }
}
