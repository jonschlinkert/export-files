'use strict';

const { defineProperty } = Reflect;
const fs = require('fs');
const path = require('path');

const { shallowClone, namify } = require('./utils');
const defaultIgnores = ['.git', 'node_modules', 'test', 'tmp', 'temp', 'vendor'];

const requires = (dir, obj = {}, options = {}) => {
  if (typeof options === 'function') {
    options = { filter: options };
  }

  const opts = { case: 'auto', filter: file => file.name !== 'index.js', ...options };
  const ignoreDirs = opts.ignoreDirs ? [].concat(opts.ignoreDirs) : defaultIgnores;
  const exportsObj = opts.immutable !== false ? shallowClone(obj) : obj;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  const seen = new Map();
  let exts = opts.exts || require.extensions;

  if (Array.isArray(exts) || typeof exts === 'string') {
    const obj = {};
    for (const ext of [].concat(exts)) obj[ext] = true;
    exts = obj;
  }

  const define = (o, key, value, { filepath, dataDescriptor = false } = {}) => {
    if (seen.has(key) && options.allowDuplicates !== true) {
      const err = new Error(`Duplicate key: "${key}" exported from ${filepath}`);
      err.key = key;
      err.initial_path_with_key = seen.get(key);
      err.conflicting_path_with_key = filepath;
      throw err;
    }

    seen.set(key, filepath);

    if (dataDescriptor === true) {
      defineProperty(o, key, { value, writable: true, enumerable: true });
    } else {
      defineProperty(o, key, { configurable: true, enumerable: true, get: value });
    }
  };

  for (const file of files) {
    if (ignoreDirs.includes(file.name)) continue;
    const filepath = path.join(dir, file.name);
    file.extname = path.extname(file.name);
    file.stem = file.isFile() ? path.basename(file.name, file.extname) : file.name;

    // TODO: ts files aren't handled anyway, this is a reminder
    if (file.name.endsWith('.ts')) continue;
    if (file.isFile() && !exts[file.extname]) continue;

    const names = namify(file, opts);
    const fns = typeof opts.case !== 'function'
      ? [].concat(opts.case).map(k => names[k])
      : names;

    const keys = fns.map(fn => typeof fn === 'function' ? fn() : fn);

    if (opts.filter(file, keys, exportsObj) === false) continue;
    if (file.isDirectory()) {
      if (opts.recursive === true) {
        const newObj = {};
        const getter = () => requires(filepath, newObj, options);
        keys.forEach(key => {
          if (!(key in exportsObj)) {
            define(exportsObj, key, getter, { filepath })
          }
        });
        continue;
      }

      if (!fs.existsSync(path.join(filepath, 'index.js'))) {
        continue;
      }
    }

    if (options.merge === true || options.objectsOnly === true) {
      if (path.extname(file.name) === '.js') {
        const exported = require(filepath);
        const expNames = Object.keys(exported);

        if (expNames.length) {
          for (const name of expNames) {
            define(exportsObj, name, exported[name], { filepath, dataDescriptor: true });
          }
        }
      }
    }

    if (options.objectsOnly !== true) {
      for (const key of keys) {
        if (!(key in exportsObj)) {
          define(exportsObj, key, () => require(filepath), { filepath });
        }
      }
    }
  }

  // const keys = Object.keys(exportsObj);
  // keys.sort((a, b) => a.localeCompare(b));
  // const res = {};

  // for (const key of keys) {
  //   define(res, key, () => exportsObj[key]);
  // }
  // console.log(res)

  return exportsObj;
};

module.exports = requires;
