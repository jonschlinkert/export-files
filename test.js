/*!
 * export-files <https://github.com/jonschlinkert/export-files>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

var path = require('path');
var should = require('should');
var exportFiles = require('./');

/**
 * Support functions
 */

function rename(fp) {
  return path.basename(fp);
}

function filter(re) {
  return function(fp) {
    return re.test(fp);
  }
}

// path must be absolute for requires to work
var fixtures = path.join(process.cwd(), 'fixtures');

/**
 * Tests
 */

describe('export-files:', function() {
  it('should recurse when `true` is passed', function() {
    var files = exportFiles(fixtures, true);
    files.should.have.properties('a', 'b', 'c', 'd', 'i', 'j', 'k');
  });

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

describe('glob/regex patterns', function() {
  it('should support glob patterns for filtering files:', function() {
    var files = exportFiles(fixtures, '**/*.json');
    files.should.eql({ a: { desc: 'aaa', name: 'a.json' }, b: { bb: 'bbb' } });
  });

  it('should support regex for filtering files:', function() {
    var re = /\.json/;
    var files = exportFiles(fixtures, re);
    files.should.eql({ a: { desc: 'aaa', name: 'a.json' }, b: { bb: 'bbb' } });
  });
});

describe('callback function', function() {
  it('should allow a callback function to read files', function() {
    var files = exportFiles(fixtures, function (fp) {
      return require(fp)
    });
    files.should.have.properties('a', 'b', 'c', 'd');
    files.should.not.have.properties('i', 'j', 'k');
  });

  it('should use the callback to read files and rename keys from options:', function() {
    var files = exportFiles(fixtures, {renameKey: rename}, function (fp) {
      return require(fp);
    });

    files.should.have.properties('a.js', 'b.js', 'c.js', 'd.js');
    files.should.not.have.properties('i.js', 'j.js', 'k.js');
  });
});

describe('custom filters', function() {
  it('`.css` filter with recurse `true`', function() {
    var files = exportFiles(fixtures, true, {filter: filter(/\.css$/)});
    files.should.have.properties('a', 'e');
    files.a.should.equal('div span {\n  color: red;\n}');
    files.e.should.equal('#navbar {\n  color: black;\n}');
  });

  it('should dynamically choose the reader:', function() {
    var files = exportFiles(fixtures, false, {
      read: require('file-reader').file
    });

    files.should.have.properties('a', 'b');
  });

  it('should dynamically choose the reader:', function() {
    var files = exportFiles(fixtures + '/nested', false, {
      read: require('file-reader').file
    });

    files.should.have.properties('e', 'f', 'g');
  });

  it('should use a read function and `.yml` filter with recurse `false`', function() {
    var files = exportFiles(fixtures, false, {
      read: function(fp) {
        return require('read-yaml').sync(fp);
      },
      filter: filter(/\.ya?ml$/)
    });

    files.should.have.properties('a', 'b');
    files.a.should.have.properties('name','desc');

    files.b.should.have.property('bb');
    files.b.bb.should.equal('bbb');
  });

  it('should use a `.json` filter with recurse `true`', function() {
    var files = exportFiles(fixtures, true, {
      filter: filter(/\.json$/)
    });

    files.should.have.properties('a', 'b', 'e', 'k');
    files.a.should.have.properties('name','desc');

    files.b.should.have.property('bb');
    files.b.bb.should.equal('bbb');

    files.e.should.have.property('ee');
    files.e.ee.should.equal('eee');

    files.k.should.have.property('kk');
    files.k.kk.should.equal('kkk');
  });
});
