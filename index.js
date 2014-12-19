/*!
 * export-files <https://github.com/jonschlinkert/export-files>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function(dir, recurse, opts) {
  var o = {};

  if (typeof opts === 'boolean') {
    recurse = opts
  }
  if (typeof recurse === 'object') {
    opts = recurse
  }

  opts = opts || {};

  walk(dir, recurse, opts).forEach(function (name) {
    var fp = path.resolve(dir, name);
    var key = opts.key && opts.key(fp) || defaultKey(fp);

    if (check(fp, opts)) {
      if (opts.yaml) {
        o[key] = opts.yaml(fp);
        return;
      }
      if (opts.text) {
        o[key] = opts.read && opts.read(fp) || readFileSync(fp, opts);
        return;
      }
      o[key] = opts.read && opts.read(fp) || require(fp);
    }
  });

  return o;
};


function walk(dir, recurse, opts) {
  if (typeof dir !== 'string') {
    throw new Error('export-files expects a string as the first argument.');
  }

  var arr = [];

  try {
    var files = fs.readdirSync(dir);
    var len = files.length;
    var i = 0;

    if (Boolean(recurse) === false) {
      return files.map(function (fp) {
        return path.join(dir, fp);
      });
    }

    while (len--) {
      var fp = path.join(dir, files[i++]);
      if (opts.stat && opts.stat(fp).isDirectory() || defaultStat(fp).isDirectory()) {
        arr.push.apply(arr, walk(fp, recurse, opts));
      } else {
        arr = arr.concat(fp);
      }
    }
  } catch(err) {}

  return arr;
}

function check(fp, opts) {
  return (opts.filter && opts.filter(fp) || defaultFilter(fp)) &&
    !/index\.js$/.test(path.basename(fp)) &&
    (opts.stat && opts.stat(fp).isFile() || defaultStat(fp).isFile())
}

function defaultKey(fp) {
  return path.basename(fp, path.extname(fp));
}

function defaultFilter(fp) {
  return /\.js$/.test(fp);
}

function defaultStat(fp) {
  return fs.statSync(fp);
}

function readFileSync(fp, opts) {
  opts = opts || {};
  var noThrow = opts && !opts.throws

  opts.encoding = opts.encoding || opts.enc || 'utf-8'

  if (!noThrow) {
    return fs.readFileSync(fp, opts)
  }

  try {
    return fs.readFileSync(fp, opts)
  } catch (err) {
    return null;
  }
}
