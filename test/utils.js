'use strict';

require('mocha');
const assert = require('assert').strict;
const utils = require('../utils');

describe('utils', () => {
  it('should camelcase', () => {
    assert.equal(utils.camelcase('---foo.bar'), 'fooBar');
    assert.equal(utils.camelcase('foo.bar'), 'fooBar');
    assert.equal(utils.camelcase('foo_bar'), 'fooBar');
    assert.equal(utils.camelcase('foo-bar'), 'fooBar');
    assert.equal(utils.camelcase('foo bar'), 'fooBar');
    assert.equal(utils.camelcase('BBB-Bar'), 'BBBBar');
    assert.equal(utils.camelcase('BBB Bar'), 'BBBBar');
  });

  it('should snakecase', () => {
    assert.equal(utils.snakecase('---foo.bar'), 'foo_bar');
    assert.equal(utils.snakecase('foo.bar'), 'foo_bar');
    assert.equal(utils.snakecase('foo_bar'), 'foo_bar');
    assert.equal(utils.snakecase('foo-bar'), 'foo_bar');
    assert.equal(utils.snakecase('foo bar'), 'foo_bar');
    assert.equal(utils.snakecase('BBB-Bar'), 'bbb_bar');
    assert.equal(utils.snakecase('BBB Bar'), 'bbb_bar');
    assert.equal(utils.snakecase('TableRow'), 'table_row');
  });
});
