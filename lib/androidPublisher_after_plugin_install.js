module.exports = function(context) {
   //Simple workaround to get package.json read and npm started in once the plugin is installed
   require('child_process').exec('npm install', {cwd: context.opts.plugin.dir});
}
