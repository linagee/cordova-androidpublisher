module.exports = function(context) {
   var exec = require('child_process').exec;
   exec('npm install');
}
