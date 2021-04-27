'use strict';

const { defineProperty, getOwnPropertyDescriptor, ownKeys } = Reflect;
const variableRegex = /^[_$a-zA-Z][_$a-zA-Z0-9]*$/;

exports.shallowClone = obj => {
  if (typeof obj === 'function') return obj;
  const Ctor = obj.constructor;
  const res = new Ctor();
  for (const key of ownKeys(obj)) {
    defineProperty(res, key, getOwnPropertyDescriptor(obj, key));
  }
  return res;
};

exports.isValidName = name => variableRegex.test(name);
exports.isUpperCase = name => /[A-Z]/.test(name[0]);

exports.changecase = (input, replacer) => {
  return input.replace(/[^a-z0-9]+([a-z0-9])|[^\w]/gi, replacer);
};

exports.camelcase = input => {
  const output = exports.changecase(input, (m, $1) => $1 ? $1.toLocaleUpperCase() : '');

  if (!/^[A-Z]{2}/.test(output)) {
    return output[0].toLocaleLowerCase() + output.slice(1);
  }

  return output;
};

exports.pascalcase = name => name[0].toLocaleUpperCase() + name.slice(1);
exports.snakecase = input => {
  return exports.changecase(input, (m, $1) => $1 ? '_' + $1 : '').toLocaleLowerCase();
};

exports.namify = (file, options) => {
  const stem = file.stem;

  if (typeof options.case === 'function') {
    return [].concat(options.case(stem));
  }

  const names = {
    stem: () => stem,
    name: () => stem,
    basename: () => file.name,
    pascal: () => exports.pascalcase(exports.camelcase(stem)),
    camel: () => exports.camelcase(stem),
    lower: () => exports.camelcase(stem).toLowerCase(),
    snake: () => exports.snakecase(stem),
    auto() {
      if (!exports.isValidName(stem)) {
        return exports.isUpperCase(stem) ? names.pascal() : names.camel();
      }
      return stem;
    }
  };

  return names;
};

