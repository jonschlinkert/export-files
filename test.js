/*!
 * export-files <https://github.com/jonschlinkert/export-files>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var assert = require('assert');
var should = require('should');

// path must be absolute for requires to work
var files = require('./')(process.cwd() + '/fixtures/');

describe('files', function () {
  it('should return the modules from the given cwd:', function () {
    files.should.have.properties('a', 'b', 'c', 'd');
    files.d.should.have.properties('foo', 'bar', 'baz');
  });
});
