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

describe('export-files:', function() {
  it('should recurse when `true` is passed', function(done) {
    var files = require('./')(fixtures, true);
    files.should.have.properties('a', 'b', 'c', 'd', 'i', 'j', 'k');
    done();
  });

  it('should return the modules from the given cwd', function(done) {
    var files = require('./')(fixtures);
    files.should.have.properties('a', 'b', 'c', 'd');
    files.d.should.have.properties('foo', 'bar', 'baz');
    done();
  });

  it('should not recurse by default', function(done) {
    var files = require('./')(fixtures);
    files.should.have.properties('a', 'b', 'c', 'd');
    files.should.not.have.properties('i', 'j', 'k');
    done();
  });

  describe('custom filters', function() {
    it('`.css` filter with recurse `true`', function(done) {
      var opts = {
        text: true,
        filter: function(fp) {
          return /\.css$/.test(path.basename(fp));
        }
      };
      var files = require('./')(fixtures, true, opts);
      files.should.have.properties('a', 'e');
      files.a.should.equal('div span {\n  color: red;\n}');
      files.e.should.equal('#navbar {\n  color: black;\n}');
      done();
    });

    it('`.yml` filter with recurse `false`', function(done) {
      var opts = {
        yaml: function(fp) {
          return require('read-yaml').sync(fp)
        },
        filter: function(fp) {
          return /\.yml$/.test(path.basename(fp));
        }
      };
      var files = require('./')(fixtures, false, opts);

      files.should.have.properties('a', 'b');
      files.a.should.have.properties('name','desc');

      files.b.should.have.property('bb');
      files.b.bb.should.equal('bbb');
      done();
    });


    it('`.json` filter with recurse `true`', function(done) {
      var opts = {
        filter: function(fp) {
          return /\.json$/.test(path.basename(fp));
        }
      };
      var files = require('./')(fixtures, true, opts);

      files.should.have.properties('a', 'b', 'e', 'k');
      files.a.should.have.properties('name','desc');

      files.b.should.have.property('bb');
      files.b.bb.should.equal('bbb');

      files.e.should.have.property('ee');
      files.e.ee.should.equal('eee');

      files.k.should.have.property('kk');
      files.k.kk.should.equal('kkk');
      done();
    });
  });
});
