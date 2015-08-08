/*!
 * export-files <https://github.com/jonschlinkert/export-files>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var lazy = require('lazy-cache')(require);
var lazyPath = lazy('path');
var lazyFs = lazy('fs');

module.exports = function exportFiles(dir) {
  if (typeof dir !== 'string') {
    throw new TypeError('export-files expects `dir` to be a string.');
  }

  var path = lazyPath();
  var fs = lazyFs();

  var dirs = tryReaddir(dir);
  var len = dirs.length;
  var res = {}

  while (len--) {
    var name = dirs[len];
    var fp = path.resolve(dir, name);
    if (!fs.statSync(fp).isDirectory() && isValid(fp)) {
      defineProp(res, basename(name), lazy(fp));
    }
  }
  return res;
};

function isValid(fp) {
  return fp.indexOf('index.js') === -1
    && fp.substr(-3) === '.js';
}

function basename(fp) {
  return fp.substr(0, fp.length - 3);
}

function tryReaddir(fp) {
  var fs = lazyFs();
  try {
    return fs.readdirSync(fp);
  } catch(err) {
    err.origin = __dirname;
    err.msg = 'export-dirs cannot read directory: ' + fp;
    throw new Error(err);
  }
}

function defineProp (obj, name, lazyMod) {
  Object.defineProperty(obj, name, {
    enumerable: true,
    configurable: true,
    get: function () {
      return lazyMod();
    }
  });
}
