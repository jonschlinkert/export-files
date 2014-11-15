# export-files [![NPM version](https://badge.fury.io/js/export-files.svg)](http://badge.fury.io/js/export-files)

> node.js utility for exporting a directory of files as modules.

## Install
### Install with [npm](npmjs.org)

```bash
npm i export-files --save
```

## Run tests

```bash
npm test
```

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

To only return modules in the immediate directory (e.g. don't recurse):

```js
// pass `false` as the last parameter
module.exports = require('export-files')(__dirname, false);
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

_This file was generated by [verb](https://github.com/assemble/verb) on November 15, 2014._