module.exports = function(context) {
   require('child_process').exec('npm install', {cwd: context.opts.plugin.dir});
}
