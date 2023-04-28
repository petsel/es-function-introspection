import {
  exclusivelyNonNewableBuiltInConstructors,
  withoutNewInstantiatingBuiltInConstructors,
} from '../config';

import { getFunctionSignature } from '../utility';

import { isFunction, isGeneratorType } from './isFunction';

/**
 * @module isConstructable
 * @typicalname Function.isConstructable
 */

/**
 * Checks whether a passed `value` is possibly constructable.
 *
 * It does so by testing the passed value's `[[construct]]`
 * slot without trying the value's invocation.
 *
 * The `construct` proxy handler is allowed to overwrite
 * the `[[construct]]` slot of a proxyfied/proxied value,
 * but it can not turn something non constructable into
 * a constructable type.
 *
 *  - see ... [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/construct]
 *     > "The `handler.construct` method is a trap for the `[[Construct]]`
 *     > object internal method, which is used by operations such as the
 *     > `new` operator. In order for the `new` operation to be valid on
 *     > the resulting `Proxy` object, the `target` used to initialize
 *     > the proxy must itself be a valid constructor."
 *
 *  - Thus it is feasibly enough to let the construct trap
 *    return an object instance.
 *
 * @param value{any}
 * @returns {boolean}
 *  A boolean value which indicates whether the tested
 *  type could possibly serve as constructor function.
 */
export function hasConstructSlot(value) {
  let canConstruct = false;
  try {
    // eslint-disable-next-line no-new
    new new Proxy(value, { construct: () => ({}) })();
    canConstruct = true;
  } catch (err) {
    /* empty */
  }
  return canConstruct;
}

/**
 * Detects whether the passed `value` is a constructable
 * function type.
 *
 * It does so by testing the `[[construct]]` slot of the
 * passed possibly constructable type, but it does not
 * invoke it.
 *
 * The `construct` proxy handler is allowed to overwrite
 * the `[[construct]]` slot of a proxyfied/proxied value,
 * but it can not turn something non constructable into
 * a constructable type.
 *
 *  - see ... [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/construct]
 *     > "The `handler.construct` method is a trap for the `[[Construct]]`
 *     > object internal method, which is used by operations such as the
 *     > `new` operator. In order for the `new` operation to be valid on
 *     > the resulting `Proxy` object, the `target` used to initialize
 *     > the proxy must itself be a valid constructor."
 *
 *  - Thus it is feasibly enough to let the construct trap
 *    return an object instance.
 *
 * **Note:**
 *
 * The [[construct]] slot of either type of generator functions,
 * async or not, indicates that generator functions are not
 * constructable, despite each returning a valid instance of
 * its type when being invoked with just the call/`()` operator.
 *
 * Therefore this implementation of an introspective `isConstructable`
 * functionality recognizes generator functions as _**constructable**_.
 *
 * This method is recommended and **safe**.
 *
 * @param value{any}
 * @returns {boolean}
 *  A boolean value which indicates whether the
 *  tested type can serve as constructor function.
 */
export function isConstructable(value) {
  return (
    isGeneratorType(value) || (isFunction(value) && hasConstructSlot(value))
  );
}

/**
 * Detects whether the passed `value` is capable of
 * serving as constructor function which safely can
 * be invoked with the `new` operator.
 *
 * This method is considered helpful and **reliable**.
 *
 * @param value{any}
 * @returns {boolean}
 *  A boolean value which indicates whether the tested
 *  type can be safely invoked with the `new` operator.
 */
export function isConstructableWithNew(value) {
  return (
    isFunction(value) &&
    hasConstructSlot(value) &&
    !exclusivelyNonNewableBuiltInConstructors.has(value)
  );
}

/**
 * Detects whether the passed `value` can be considered
 * a constructor function which can be invoked without
 * the `new` (or with just the call/`()`) operator.
 *
 * **Note:**
 *
 * The [[construct]] slot of either type of generator functions,
 * async or not, indicates that generator functions are not
 * constructable, despite each returning a valid instance of
 * its type when being invoked with just the call/`()` operator.
 *
 * Therefore this implementation of an introspective `isConstructable`
 * functionality recognizes generator functions as _**constructable**_.
 *
 * This method is considered helpful and **reliable**.
 *
 * @param value{any}
 * @returns {boolean}
 *  A boolean value which indicates whether a detected
 *  constructor function can be invoked without the
 *  `new` operator as well.
 */
export function isConstructableWithoutNew(value) {
  return (
    isGeneratorType(value) ||
    (isFunction(value) &&
      hasConstructSlot(value) &&
      !getFunctionSignature(value).startsWith('class ') &&
      withoutNewInstantiatingBuiltInConstructors.has(value))
  );
}
