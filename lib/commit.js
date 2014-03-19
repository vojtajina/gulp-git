var through = require('through2');
var gutil = require('gulp-util');
var exec = require('child_process').exec;
var escape = require('any-shell-escape');
var _ = require('lodash');

module.exports = function (message, opt) {
  if(!opt) opt = {};
  if(!message) throw new Error('gulp-git: Commit message is required git.commit("commit message")');
  if(!opt.args) opt.args = ' ';

  var files = [];
  var cwd = '';
  var meta = {};

  var stream = through.obj(function(file, enc, cb) {
    this.push(file);
    files.push(file.path);
    if (file.meta) {
      meta = file.meta;
    }

    cwd = file.cwd;
    cb();
  }).on('data', function(){

  }).on('end', function(){
    var cmd = 'git commit -m "' + _.template(message, meta) + '" ' + escape(files) + ' ' + opt.args;
      exec(cmd, {cwd: cwd}, function(err, stdout, stderr){
        if(err) gutil.log(err);
        gutil.log(stdout, stderr);
        stream.emit('commit_done');
    });
  });

  return stream;
};
