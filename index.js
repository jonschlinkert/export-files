/*!
 * export-files <https://github.com/jonschlinkert/export-files>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function(dir) {
  var o = {};

  fs.readdirSync(dir).forEach(function (name) {
    var base = path.basename(name, path.extname(name));
    var fp = path.resolve(dir, name);

    if (/\.js$/.test(name) && !/index/.test(name) && fs.statSync(fp).isFile()) {
      o[base] = require(fp);
    }
  });

  return o;
};
