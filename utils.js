'use strict';

const { defineProperty, getOwnPropertyDescriptor, ownKeys } = Reflect;
const variableRegex = /^[_$a-zA-Z][_$a-zA-Z0-9]*$/;

const titlecase = s => s[0].toLocaleUpperCase() + s.slice(1).toLocaleLowerCase();

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

exports.split = input => {
  return input.split(/([0-9A-Z][a-z]+|[^\W_]+)|[\W_]+/).filter(Boolean);
};

exports.camelcase = input => {
  const words = exports.split(input);
  let output = '';

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    output += /^[A-Z]{2}/.test(w) ? w : i === 0 ? w.toLocaleLowerCase() : titlecase(w);
  }

  return output;
};

exports.pascalcase = name => name[0].toLocaleUpperCase() + name.slice(1);
exports.snakecase = input => exports.split(input).join('_').toLocaleLowerCase();

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

