/*!
 * export-files <https://github.com/jonschlinkert/export-files>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function(dir, recurse) {
  var o = {};

  walk(dir, recurse).forEach(function (name) {
    var base = path.basename(name, path.extname(name));
    var fp = path.resolve(dir, name);

    if (/\.js$/.test(name) && !/index/.test(name) && fs.statSync(fp).isFile()) {
      o[base] = require(fp);
    }
  });

  return o;
};


function walk(dir, recurse) {
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
      if (fs.statSync(fp).isDirectory()) {
        arr.push.apply(arr, walk(fp, recurse));
      } else {
        arr = arr.concat(fp);
      }
    }
  } catch(err) {}

  return arr;
}