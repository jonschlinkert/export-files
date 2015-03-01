/*!
 * export-files <https://github.com/jonschlinkert/export-files>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var map = require('arr-map')
var typeOf = require('kind-of');
var isGlob = require('is-glob');
var extend = require('extend-shallow');
var mm = require('micromatch');

/**
 * Expose `exportFiles`
 */

module.exports = exportFiles;

/**
 * Export files from the give `directory` filtering the
 * results with
 *
 * @param  {String} `directory` Use `__dirname` for the immediate directory.
 * @param  {String|Array} `patterns` Glob patterns to use for matching.
 * @param  {Boolean} `recurse` Pass `true` to recurse deeper than the current directory.
 * @param  {String} `options`
 * @param  {Function} `fn` Callback for filtering.
 * @return {String}
 */

function exportFiles(dir, patterns, recurse, options, fn) {
  if (arguments.length === 1 && !isGlob(dir)) {

    var key = 'exportFiles:' + dir;
    if (cache.hasOwnProperty(key)) {
      return cache[key];
    }

    var result = lookup(dir, false, {}).reduce(function (res, fp) {
      if (filter(fp, fn)) {
        res[basename(fp)] = read(fp, fn);
      }
      return res;
    }, {});
    return (cache[key] = result);
  }
  return explode.apply(explode, arguments);
}

var cache = exportFiles.cache = {};

function explode(dir, patterns, recurse, options, fn) {
  // don't slice args for v8 optimization
  var len = arguments.length - 1;
  var args = new Array(len);
  for (var i = 0; i < len; i++) {
    args[i] = arguments[i + 1];
  }

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
}

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

  var key = 'lookup:' + dir + ('' + recurse);
  if (cache.hasOwnProperty(key)) {
    return cache[key];
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
  return (cache[key] = res);
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
  return basename(fp);
}

/**
 * Get the basename of a file path.
 */

function basename(fp) {
  return path.basename(fp, path.extname(fp));
}

/**
 * Read or require the given file with `opts`
 */

function read(fp, opts, fn) {
  opts = opts || {};
  opts.encoding = opts.encoding || 'utf8';

  if (opts.read) {
    return opts.read(fp, opts);
  } else if (fn) {
    return fn(fp, opts);
  }

  if (endsWith(fp, '.js')) {
    return tryRequire(fp);
  } else {
    var str = tryCatch(fs.readFileSync, fp, opts);
    if (endsWith(fp, '.json')) {
      return tryCatch(JSON.parse, str);
    }
    return str;
  }
}

/**
 * Keep try-catch isolated for v8 optimizations
 */

function tryCatch(fn, str, opts) {
  try {
    return fn(str, opts);
  } catch(err) {}
  return {};
}

function tryRequire(fp) {
  try {
    return require(path.resolve(fp));
  } catch(err) {}
  return null;
}

/**
 * Return true if `str` ends with `ch`aracters
 */

function endsWith(str, ch) {
  return str.slice(-ch.length) === ch;
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
