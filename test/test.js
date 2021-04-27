/*!
 * export-files <https://github.com/jonschlinkert/export-files>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

const { hasOwnProperty } = Reflect;
require('mocha');
const path = require('path');
const assert = require('assert');
const exportFiles = require('..');
const fixtures = path.join(__dirname, 'fixtures');

describe('export-files:', () => {
  const opts = { allowDuplicates: true };

  it('should return the modules from the given cwd', () => {
    const files = exportFiles(fixtures, undefined, opts);
    for (const key of ['a', 'b', 'c', 'd', 'folder']) {
      assert(hasOwnProperty.call(files, key));
    }

    for (const key of ['foo', 'bar', 'baz']) {
      assert(hasOwnProperty.call(files.d, key));
    }
  });

  it('should not recurse by default', () => {
    const files = exportFiles(fixtures, undefined, opts);
    assert(!hasOwnProperty.call(files.folder, 'e'));
    assert(!hasOwnProperty.call(files.folder, 'f'));
    assert(!hasOwnProperty.call(files.folder, 'g'));
    assert(!hasOwnProperty.call(files.folder, 'h'));
  });

  it('should recurse when options.recursive is true', () => {
    const files = exportFiles(fixtures, undefined, { recursive: true, ...opts });

    assert(hasOwnProperty.call(files.folder, 'e'));
    assert(hasOwnProperty.call(files.folder, 'f'));
    assert(hasOwnProperty.call(files.folder, 'g'));
    assert(hasOwnProperty.call(files.folder, 'h'));

    assert(hasOwnProperty.call(files.folder.nested, 'i'));
    assert(hasOwnProperty.call(files.folder.nested, 'j'));
    assert(hasOwnProperty.call(files.folder.nested, 'k'));
  });

  it('should use a custom filter function', () => {
    const filter = file => file.stem !== 'a';
    const files = exportFiles(fixtures, undefined, { filter, ...opts });

    assert(!hasOwnProperty.call(files, 'a'));
    assert(hasOwnProperty.call(files, 'b'));
    assert(hasOwnProperty.call(files, 'c'));
    assert(hasOwnProperty.call(files, 'd'));
  });

  it('should use a custom case function', () => {
    const files = exportFiles(fixtures, undefined, {
      case: name => name === 'folder' ? name : name.toUpperCase(),
      ...opts
    });

    assert(!hasOwnProperty.call(files.folder, 'E'));
    assert(!hasOwnProperty.call(files.folder, 'F'));
    assert(!hasOwnProperty.call(files.folder, 'G'));
    assert(!hasOwnProperty.call(files.folder, 'H'));
  });
});
