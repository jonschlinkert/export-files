/**
 * export-files <https://github.com/jonschlinkert/export-files>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var map = require('arr-map')
var typeOf = require('kind-of');
var extend = require('extend-shallow');
var mm = require('micromatch');

/**
 * Expose `exportFiles`
 */

module.exports = function exportFiles(dir, patterns, recurse, options, fn) {
  var args = [].slice.call(arguments, 1);
  var rest = sortArgs(args);

  patterns = rest['string'] || rest['array'] || rest['regexp'];
  recurse = rest['boolean'];
  options = rest['object'];
  fn = rest['function'];

  var opts = extend({recurse: recurse || false}, options);
  if (patterns) {
    opts.filter = function (fp) {
      return mm.isMatch(fp, patterns);
    };
  }

  return lookup(dir, opts.recurse, opts).reduce(function (res, fp) {
    if (filter(fp, opts, fn)) {
      res[renameKey(fp, opts)] = read(fp, opts, fn);
    }
    return res;
  }, {});
};

/**
 * Recursively read directories, starting with the given `dir`.
 *
 * @param  {String} `dir`
 * @param  {Boolean} `recurse` Should the function recurse?
 * @return {Array} Returns an array of files.
 */

function lookup(dir, recurse) {
  if (typeof dir !== 'string') {
    throw new Error('export-files expects a string as the first argument.');
  }

  var files = fs.readdirSync(dir);
  var len = files.length;
  var res = [];

  if (recurse === false) return map(files, resolve(dir));

  while (len--) {
    var fp = path.resolve(dir, files[len]);
    if (isDir(fp)) {
      res.push.apply(res, lookup(fp, recurse));
    } else {
      res.push(fp);
    }
  }
  return res;
}

/**
 * Rename object keys with a custom function.
 * If no function is passed, the basname is
 * returned.
 */

function renameKey(fp, opts) {
  if (opts && opts.renameKey) {
    return opts.renameKey(fp, opts);
  }

  var ext = path.extname(fp);
  return path.basename(fp, ext);
}

/**
 * Read or require the given file with `opts`
 */

function read(fp, opts, fn) {
  opts = extend({encoding: 'utf8'}, opts);
  if (opts.read) {
    return opts.read(fp, opts);
  } else if (fn) {
    return fn(fp, opts);
  } else {
    try {
      if (/\.js(on)?$/.test(fp)) {
        return require(fp);
      } else {
        return fs.readFileSync(fp, opts);
      }
    } catch (err) {
      if (!opts.silent) throw err;
    }
  }
}

/**
 * Validate (filter) files using the given filter
 * function, falling back on the default filter.
 */

function filter(fp, opts) {
  if (opts && opts.filter) {
    return opts.filter(fp, opts);
  }
  return /[^x]\.js$/.test(fp);
}

/**
 * Utility functions
 */

function isDir(fp) {
  return fs.statSync(fp).isDirectory();
}

function resolve(dir) {
  return function (fp) {
    return path.resolve(dir, fp);
  };
}

function sortArgs (args) {
  var len = args.length;
  var res = {};

  while (len--) {
    var arg = args[len];
    res[typeOf(arg)] = arg;
  }

  return res;
}
