import {
  hasWritablePrototype,
  getFunctionSignature,
  getInternalTypeName,
  getFunctionName,
} from '../utility';

/**
 * @module isFunction
 * @typicalname Function.isFunction
 */

/* eslint-disable yoda */

/**
 * Detects any function type, which is ...
 * not only the `typeof` operator returns
 * the `'function'` string for the operated
 * `value`, but the latter also features both
 * of a function's call methods `call` and `apply`.
 *
 * This method is essential and **safe**.
 *
 * @param value{any}
 * @returns {boolean}
 *  A boolean value which indicates whether
 *  the tested type is a function.
 */
export function isFunction(value) {
  return (
    'function' === typeof value &&
    'function' === typeof value.call &&
    'function' === typeof value.apply
  );
}
/* eslint-enable yoda */

/* eslint-disable spaced-comment */

/**
 * Detects whether the passed `value` is a
 * constructor function implemented as `class`.
 *
 * This method is recommended and **safe**.
 *
 * @param value{any}
 * @returns {boolean}
 *  A boolean value which indicates whether
 *  the tested type is a class(-constructor).
 */
export function isClass /*Constructor*/(value) {
  return (
    isFunction(value) && getFunctionSignature(value).startsWith('class ')
    // (/^class(\s+[^{]+)?\s*{/).test(getFunctionSignature(value))
  );
}

/**
 * Detects whether the passed `value` is either
 * kind of arrow function, async or not.
 *
 * This method is recommended and **safe**.
 *
 * @param value{any}
 * @returns {boolean}
 *  A boolean value which indicates whether the
 *  tested type is either kind of arrow function.
 */
export function isArrowType(value) {
  return (
    isFunction(value) &&
    /^(?:async\s*)?(?:\(.*?\)|[^(),=]+)\s*=>/.test(getFunctionSignature(value))
  );
}

/**
 * Detects whether the passed `value` is either
 * kind of generator function, async or not.
 *
 * This method is recommended and **safe**.
 *
 * @param value{any}
 * @returns {boolean}
 *  A boolean value which indicates whether the
 *  tested type is either kind of generator function.
 */
export function isGeneratorType(value) {
  const typeName = !!value && getInternalTypeName(value);
  return (
    typeName &&
    (typeName === 'GeneratorFunction' || typeName === 'AsyncGeneratorFunction')
  );
}

/**
 * Detects whether the passed `value` is any
 * kind of async function type, either async
 * generator or async arrow or async function
 * expression or async function statement.
 *
 * This method is recommended and **safe**.
 *
 * @param value{any}
 * @returns {boolean}
 *  A boolean value which indicates whether the
 *  tested type is any kind of async function.
 */
export function isAsyncType(value) {
  const typeName = !!value && getInternalTypeName(value);
  return (
    typeName &&
    (typeName === 'AsyncFunction' || typeName === 'AsyncGeneratorFunction')
  );
}

/**
 * Detects whether the passed `value` is
 * explicitly an `AsyncGeneratorFunction` type.
 *
 * This method is recommended and **safe**.
 *
 * @param value{any}
 * @returns {boolean}
 *  A boolean value which indicates whether the tested
 *  type is explicitly an `AsyncGeneratorFunction` type.
 */
export function isAsyncGenerator /*Function*/(value) {
  return !!value && getInternalTypeName(value) === 'AsyncGeneratorFunction';
}

/**
 * Detects whether the passed `value` is
 * explicitly a `GeneratorFunction` type.
 *
 * This method is recommended and **safe**.
 *
 * @param value{any}
 * @returns {boolean}
 *  A boolean value which indicates whether the
 *  tested type is explicitly a `GeneratorFunction` type.
 */
export function isGeneratorFunction(value) {
  return !!value && getInternalTypeName(value) === 'GeneratorFunction';
}

/**
 * Detects whether the passed `value` is any kind of
 * non generator async function, either async arrow
 * or async function expression or async statement.
 *
 * This method is recommended and **safe**.
 *
 * @param value{any}
 * @returns {boolean}
 *  A boolean value which indicates whether the
 *  tested type is a non generator async function.
 */
export function isAsyncFunction(value) {
  return !!value && getInternalTypeName(value) === 'AsyncFunction';
}

/**
 * Detects whether the passed `value` is
 * exclusively an async arrow function.
 *
 * This method is considered _"nice to have"_
 * and **safe**.
 *
 * @param value{any}
 * @returns {boolean}
 *  A boolean value which indicates whether the
 *  tested type is exclusively an async arrow function.
 */
export function isAsyncArrow /*Function*/(value) {
  return isArrowType(value) && isAsyncFunction(value);
}

/**
 * Detects whether the passed `value` is
 * exclusively an arrow function (non async).
 *
 * This method is considered _"nice to have"_
 * and **safe**.
 *
 * @param value{any}
 * @returns {boolean}
 *  A boolean value which indicates whether the
 *  tested type is exclusively a non async arrow function.
 */
export function isNonAsyncArrow /*Function*/(value) {
  return isArrowType(value) && !isAsyncFunction(value);
}

/**
 * Detects whether the passed `value` is exclusively
 * an instance of a `Function` subclass, hence a
 * `Function` subtype of e.g. following form ...
 *
 * ```
 * class Applicator extends Function {
 *   constructor(...args) {
 *     super(...args);
 *   }
 * }
 * // - constructable and callable instance of the
 * //   custom `Applicator` function subtype/class.
 * const applicator = new Applicator();
 * ```
 *
 * This method is considered _"nice to have"_
 * and **safe**.
 *
 * @param value{any}
 * @returns {boolean}
 *  A boolean value which indicates whether the tested
 *  type is a `Function` subtype (an instance of a class
 *  which extends `Function`).
 */
export function isExtendedFunction(value) {
  return (
    isFunction(value) &&
    getFunctionSignature(Object.getPrototypeOf(value).constructor).startsWith(
      'class ',
    )
  );
}

/**
 * Detects whether the passed `value` is the
 * function type exclusively known back at ES3
 * (in addition to all the built-in constructor functions).
 *
 * This method is recommended and **safe**.
 *
 * @param value{any}
 * @returns {boolean}
 *  A boolean value which indicates whether the
 *  tested type is exclusively the only known
 *  function type back at ES3 (in addition to
 *  all the built-in constructor functions).
 */
export function isES3Function(value) {
  return (
    isFunction(value) &&
    hasWritablePrototype(value) &&
    !isGeneratorType(value) &&
    !getFunctionSignature(Object.getPrototypeOf(value).constructor).startsWith(
      'class ',
    )
    // !isExtendedFunction(value)
  );
}

/**
 * Detects whether the passed `value` is by all means a
 * generic (or unspecific/non-specific) function, hence ...
 *
 *  - either a good old ES3 function,
 *  - or a non async arrow function.
 *
 * Thus following specific (non-generic) function types
 * are excluded ...
 *
 *  - class constructors,
 *  - any kind of generators,
 *  - async function types,
 *  - extended `Function` types,
 *  - built-in constructor functions,
 *  - Web Api constructor functions.
 *
 * This method is recommended and **safe**.
 *
 * @param value{any}
 * @returns {boolean}
 *  A boolean value which indicates whether the tested
 *  type is either a non async arrow function or a good
 *  old ES3 function.
 */
export function isGenericFunction(value) {
  return isES3Function(value) || isNonAsyncArrow(value);
}

/**
 * Detects whether the passed `value` is any
 * kind of function type but without a given name.
 *
 * This method is considered _"nice to have"_
 * and **safe**.
 *
 * @param value{any}
 * @returns {boolean}
 *  A boolean value which indicates whether
 *  the tested type is an unnamed function.
 */
export function isUnnamedFunction(value) {
  return isFunction(value) && getFunctionName(value) === '';
}

/* eslint-enable spaced-comment */
