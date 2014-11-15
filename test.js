/*!
 * export-files <https://github.com/jonschlinkert/export-files>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var path = require('path');
var should = require('should');

// path must be absolute for requires to work
var fixtures = path.join(process.cwd(), 'fixtures');

describe('files', function () {
  it('should return the modules from the given cwd:', function () {
    var files = require('./')(fixtures);
    files.should.have.properties('a', 'b', 'c', 'd');
    files.d.should.have.properties('foo', 'bar', 'baz');
  });

  it('should not recurse by default:', function () {
    var files = require('./')(fixtures);
    files.should.have.properties('a', 'b', 'c', 'd');
    files.should.not.have.properties('i', 'j', 'k');
  });

  it('should recurse when `true` is passed:', function () {
    var files = require('./')(fixtures, true);
    files.should.have.properties('a', 'b', 'c', 'd', 'i', 'j', 'k');
  });
});
