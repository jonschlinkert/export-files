# export-files  [![Build Status](https://travis-ci.org/jonschlinkert/export-files.svg)](https://travis-ci.org/jonschlinkert/export-files)  [![NPM version](https://badge.fury.io/js/export-files.svg)](http://badge.fury.io/js/export-files)

> node.js utility for exporting a directory of files as modules.

## Install with [npm](npmjs.org)

```bash
npm i export-files --save
```

## Usage

Specify the directory with files to export (this is a **required** argument):

```js
module.exports = require('export-files')(__dirname);
//=> {a: [function], b: [function], c: [function]}
```

### Params

```js
module.exports = require('export-files')(dir, patterns, recurse, options, fn);
```

* `dir` **{String}**: (required) directory with files to export.
* `patterns` **{String|Array|RegExp}**: (optional) glob patterns or regex for filtering files
* `recurse` **{Boolean|Object}**: (optional) or options. When `true` reads directories recursivly. Default is `false`.
* `options` **{Object}**: (optional) options for filtering, reading, and recursion.
    - `read` **{Function}**: function for reading or requiring files
    - `renameKey` **{Function}**: function for naming keys on the returned object
    - `filter` **{Function}**: function for filtering files
* `fn` **{Function}**: (optional) pass a custom reader function.

## Examples

### glob patterns

Filter and require only `.json` files:

```js
module.exports = require('export-files')(__dirname, '**/*.json');
```

Filter and require only `.yml` files, with a custom

```js
module.exports = require('export-files')(__dirname, '**/*.json');
```

### Regex

Filter and require only `.js` files:

```js
module.exports = require('export-files')(__dirname, /\.js$/);
```

## Run Tests

Install dev dependencies:

```bash
npm i -d && npm test
```

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/export-files/issues)

## Author

**Jon Schlinkert**
 
+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert) 

## License
Copyright (c) 2014-2015 Jon Schlinkert  
Released under the MIT license

***

_This file was generated by [verb](https://github.com/assemble/verb) on January 31, 2015._