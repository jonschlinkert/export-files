# export-files [![NPM version](https://badge.fury.io/js/export-files.svg)](http://badge.fury.io/js/export-files)

> node.js utility for exporting a directory of files as modules.

## Install with [npm](npmjs.org)

```bash
npm i export-files --save
```

## API

### [.exportFiles](index.js#L22)
> See [tests](./test.js) for more examples

* `dir` **{String}**: directory to read and export
* `recurse` **{Boolean}**: when `true`, read directory recursivly, default `false`
* `opts` **{Object}**: control options
  - `recurse` **{Boolean}** guess.. if defined will be overwritten
  - `text` **{Boolean}** should be `true` when you want to export other files, eg `.css`
  - `key` **{Function}** `function(fp, opts)`, where `opts` is same provided options object
  - `read` **{Function}** `function(fp, opts)`, where `fp` is full filepath, default is `fs.readFileSync`
  - `stat` **{Function}** `function(fp, opts)`, custom stat function, default is `fs.statSync`
  - `yaml` **{Function}** `function(fp, opts)`
  - `filter` **{Function}** signature `function(fp, opts)`, default filter is only for `.js` files
  - `*` **{*}**: any other options, eg `encoding` for `fs.readFileSync` or your custom `opts.read` fn
* `returns`: {Object}


## Usage
Given you have the following files:
```
lib/
  foo.js
  bar.js
  baz.js
```

Add the following to `lib/index.js`:

```js
module.exports = require('export-files')(__dirname);
//=> {foo: [function], bar: [function], baz: [function]}
```
> Notice: you can control key names of the object with providing function to `opts.key`

To only return modules in the immediate directory (e.g. don't recurse):

```js
// pass `false` as second or third parameter
module.exports = require('export-files')(__dirname, false, opts);
// or
module.exports = require('export-files')(__dirname, opts, false);
```

## Run Tests
```bash
npm test
```

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/export-files/issues)

## Author

**Jon Schlinkert**
 
+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert) 

## License
Copyright (c) 2014 Jon Schlinkert  
Released under the MIT license

***

_This file was generated by [verb](https://github.com/assemble/verb) on December 20, 2014._