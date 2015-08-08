/*!
 * export-files <https://github.com/jonschlinkert/export-files>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
require('should');
var exportFiles = require('./');

// path must be absolute for requires to work
var fixtures = path.join(process.cwd(), 'fixtures');

/**
 * Tests
 */

describe('export-files:', function() {
  it('should return the modules from the given cwd', function() {
    var files = exportFiles(fixtures);
    files.should.have.properties('a', 'b', 'c', 'd');
    files.d.should.have.properties('foo', 'bar', 'baz');
  });

  it('should not recurse by default', function() {
    var files = exportFiles(fixtures);
    files.should.have.properties('a', 'b', 'c', 'd');
    files.should.not.have.properties('i', 'j', 'k');
  });
});
