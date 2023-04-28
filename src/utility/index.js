/**
 * @module utility
 * @typicalname utility
 */

/**
 * Detects whether a passed function type features a truly `writable`
 * `prototype` property.
 *
 * @param value{Function}
 *  Assumes a `'function'` type, but does not check for it.
 * @returns {boolean}
 *  Returns whether the passed type features a truly `writable`
 *  `prototype` property
 */
export function hasWritablePrototype(value) {
  return Object.getOwnPropertyDescriptor(value, 'prototype')?.writable === true;
}

/**
 * Implements a sophisticated guess, which is considered to be
 * more than just reliable but also not entirely bulletproof.
 * The constraint is due to any function's `name` related
 * property descriptor which by default, hence without any
 * intentional further change, is ...
 *
 * ```
 * { ... writable: false, enumerable: false, configurable: true }
 * ```
 *
 * ...
 *  - neither writable
 *  - nor enumerable
 *  - but configurable.
 *
 * Thus something like ...
 *
 * ```
 * Object.defineProperty(fct, 'name', { value: 'FOO' })
 * ```
 *
 * ... will change any passed function's `name` value to "FOO".
 * As long as the latter can be safely excluded, the detection
 * approach is safe.
 *
 * @param value{Function}
 *  Assumes a `'function'` type, but does not check for it.
 * @returns {string}
 *  Always a `'string'` value which for unnamed functions
 *  is the empty string value/`''`.
 */
export function getFunctionName(value) {
  return Object.getOwnPropertyDescriptor(value, 'name').value;
  // return value.name;
}

/**
 * Retrieves for an even multiple times bound
 * function's name the original function's name.
 *
 * @param name{string}
 *  Assumes a function's `name`.
 * @returns {string}
 *  Always a `'string'` value which for unnamed
 *  functions is the empty string value/`''`.
 */
export function getUnboundName(name) {
  // - very reliable approach unless a bound function's `name` value has been
  //   reconfigured via  `Object.defineProperty(fct, 'name', { value: '...' })`.
  // - takes multiple bound functions into account
  return name.split(/(?:bound )+/).at(-1);
}

// /**
//  * Retrieves for an even multiple times bound function
//  * the original function's name
//  *
//  * @param value{Function}
//  *  Assumes a `'function'` type, but does not check for it.
//  * @returns {string}
//  *  Always a `'string'` value which for unnamed functions
//  *  is the empty string value/`''`.
//  */
// export function getUnboundFunctionName(value) {
//   return getFunctionName(value)
//     .split(/(?:bound )+/)
//     .at(-1);
// }

/**
 * Reaches for a function's stringified version by making
 * use of ...
 *
 * ```
 * Function.prototype.toString.call(value);
 * ```
 *
 * ... which helps in passing by some possibly manipulated
 * `toString` functionality.
 *
 * @param value{Function}
 *  Assumes a `'function'` type, but does not check for it.
 * @returns {string}
 *  Returns a function's stringified implementation.
 */
export function getFunctionSignature(value) {
  // - going to be used just within the
  //   `isClass` and `isArrow` tests.
  return Function.prototype.toString.call(value).trim();
}

/**
 * Reaches for the passed value's internal type signature
 * by making use of ...
 *
 * ```
 * Object.prototype.toString.call(value);
 * ```
 *
 * @param value{any}
 * @returns {string}
 *  Returns a `'string'` value which always looks like e.g.
 *
 *   - `'[object Undefined]'`
 *   - `'[object Null]'`
 *   - `'[object Object]'`
 *   - `'[object Function]'`
 *   - ... and so on ...
 *
 */
export function getInternalTypeSignature(value) {
  return Object.prototype.toString.call(value).trim();
}

/**
 * Reaches for the passed value's internal type/constructor name
 * by utilizing a regex which processes type signatures like e.g.
 *
 *  - `'[object Undefined]'`
 *  - `'[object Null]'`
 *  - `'[object Object]'`
 *  - `'[object Function]'`
 *
 * ... which would result in return values like ...
 *
 *  - `'Undefined'`
 *  - `'Null'`
 *  - `'Object'`
 *  - `'Function'`
 *
 *  In addition, it does combine the regex based approach with
 *  another one that reads the constructor-name of the passed
 *  type's prototype. This second part would fail for both the
 *  `undefined` and the `null` type but covers instances of any
 *  class and all the `Error` subtypes where the first approach
 *  would fail.
 *
 * @param value{any}
 * @returns {string}
 *  Returns a `'string'` value which corresponds with the passed
 *  value's constructor name (internal type).
 */
export function getInternalTypeName(value) {
  const regXInternalTypeName = /^\[object\s+(?<name>.*)]$/;

  // eslint-disable-next-line no-unsafe-optional-chaining
  let { name } = regXInternalTypeName.exec(
    getInternalTypeSignature(value),
  )?.groups;

  if (name === 'Object') {
    const { constructor } = Object.getPrototypeOf(value);
    if (
      typeof constructor === 'function' &&
      getFunctionSignature(constructor).startsWith('class ')
    ) {
      name = getFunctionName(constructor);
    }
  } else if (name === 'Error') {
    name = getFunctionName(Object.getPrototypeOf(value).constructor);
  }
  return name;
}
