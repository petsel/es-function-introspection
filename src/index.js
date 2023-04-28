import {
  isFunction,
  isClass,
  isArrowType,
  isGeneratorType,
  isAsyncType,
  isAsyncGenerator,
  isGeneratorFunction,
  isAsyncFunction,
  isAsyncArrow,
  isNonAsyncArrow,
  isExtendedFunction,
  isES3Function,
  isGenericFunction,
  isUnnamedFunction,
} from './feature/isFunction';

import {
  isConstructable,
  isConstructableWithNew,
  isConstructableWithoutNew,
} from './feature/isConstructable';

import { isCallable } from './feature/isCallable';

import {
  isBound,
  isBoundUnnamed,
  hasBoundCallFuzziness,
  canBeBoundDistinctively,
} from './feature/isBound';

const introspections = {
  isFunction, // - essential and safe.

  isClass, // - recommended and safe.
  isArrowType, // - recommended and safe.
  isGeneratorType, // - recommended and safe.
  isAsyncType, // - recommended and safe.

  isAsyncGenerator, // - recommended and safe.
  isGeneratorFunction, // - recommended and safe.
  isAsyncFunction, // - recommended and safe.

  isAsyncArrow, // - "nice to have" and safe.
  isNonAsyncArrow, // - "nice to have" and safe.
  isExtendedFunction, // - "nice to have" and safe.

  isES3Function, // - recommended and safe.
  isGenericFunction, // - recommended and safe.

  isUnnamedFunction, // - "nice to have" and safe.

  isConstructable, // - recommended and safe.
  isConstructableWithNew, // - helpful and reliable.
  isConstructableWithoutNew, // - helpful and reliable.

  isCallable, // - helpful and reliable.

  isBound, // - helpful and safe.
  isBoundUnnamed, // - helpful and safe.
  hasBoundCallFuzziness, // - helpful and safe.
  canBeBoundDistinctively, // - helpful and safe.
};

/**
 * @module distribution
 * @typicalname distribution/library namespace
 */

/**
 * A function which restores the built-in global
 * `Function` type/namespace to its default state.
 *
 * @returns {void} No return value.
 */
function restoreFunctionDefault() {
  Reflect.ownKeys(introspections).forEach(key =>
    Reflect.deleteProperty(Function, key),
  );
}

/**
 * A function which makes introspection-functionality
 * on various function-types available as static
 * methods of the built-in global `Function` type.
 *
 * @returns {void} No return value.
 */
function augmentFunctionNamespace() {
  Object.entries(introspections).forEach(([key, value]) =>
    Reflect.defineProperty(Function, key, {
      configurable: true,
      writable: true,
      value,
    }),
  );
}

const implementation = {
  ...introspections,
  augmentFunctionNamespace,
  restoreFunctionDefault,
};
export default implementation;
