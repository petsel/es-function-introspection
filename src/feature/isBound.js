import { getFunctionName, getUnboundName } from '../utility';

import { isFunction } from './isFunction';
import { hasConstructSlot } from './isConstructable';

/**
 * @module isBound
 * @typicalname Function.isBound
 */

/**
 * Checks whether the passed `value` is an implementation of a
 * function type, which can be bound distinguishably, that is ...
 *
 *  - Any unnamed ES3 function and any unnamed class constructor,
 *    each in its bound variant, leave no trace about the original
 *    function's implementation, which otherwise would make them
 *    indistinguishable from one another. Thus, even though one
 *    still can test such bound function's `[[construct]]` slot,
 *    one can not anymore make any assumption about its very
 *    callability.
 *
 *  - Pure arrow functions as well as async and generator functions
 *    are all not constructable, which counts for each bound variant
 *    too, thus, making them feature at least one distinguishable trait,
 *    especially in terms of being possibly callable.
 *    In addition, the bound variants of async and generator functions
 *    are detectable as such, which altogether makes the bound variants
 *    of all three function types distinguishable. Thus, said functions
 *    can be distinctively bound, regardless of an empty or non-empty
 *    name value.
 *
 * This method is considered helpful and **safe**.
 *
 * @param value{any}
 * @returns {boolean}
 *  A boolean value which indicates whether the tested type is a
 *  function, which can be bound in a way, that its bound variant
 *  is distinguishable from bound variants of other function types.
 */
export function canBeBoundDistinctively(value) {
  return (
    isFunction(value) &&
    (getUnboundName(getFunctionName(value)) !== '' || !hasConstructSlot(value))
  );
  // the above implementation got derived from (and is equal to) ...
  //
  // let name;
  // // eslint-disable-next-line no-return-assign
  // return (
  //   isFunction(value) &&                          // checks for a function ...
  //   // eslint-disable-next-line no-cond-assign
  //   ((name = getFunctionName(value)) === ""       // ... which in case ...
  //     ? !isClass(value) && !isES3Function(value)  //  - of being unnamed ... is neither class nor ES3 function
  //     :                                           //  - of being named ...
  //       !name.startsWith("bound ") ||             //     - either has to be unbound
  //       getUnboundName(name) !== "" ||            //     - or, if bound, has to be bound and named
  //       !hasConstructSlot(value))                 //     - or, if bound and unnamed, does not have a [[construct]] slot.
  // );
}

/**
 * Checks whether the passed `value` is the bound variant of
 * a function type, where not any trace about the original
 * function's callability has been left.
 *
 *  - Any unnamed ES3 function and any unnamed class constructor,
 *    each in its bound variant, leave no trace about the original
 *    function's implementation, which otherwise would make them
 *    indistinguishable from one another. Thus, even though one
 *    still can test such bound function's `[[construct]]` slot,
 *    one can not anymore make any assumption about its very
 *    callability.
 *
 *  - Pure arrow functions as well as async and generator functions
 *    are all not constructable, which counts for each bound variant
 *    too, thus, making them feature at least one distinguishable trait,
 *    especially in terms of being possibly callable.
 *    In addition, the bound variants of async and generator functions
 *    are detectable as such, which altogether makes the bound variants
 *    of all three function types distinguishable. Thus, said functions
 *    can be distinctively bound, regardless of an empty or non-empty
 *    name value.
 *
 * This method is considered helpful and **safe**.
 *
 * @param value{any}
 * @returns {boolean}
 *  A boolean value which indicates whether the tested type is
 *  a bound function that's callability can neither be traced
 *  nor assured by any safe measures.
 */
export function hasBoundCallFuzziness(value) {
  let name;
  // eslint-disable-next-line no-return-assign
  return (
    isFunction(value) &&
    (name = getFunctionName(value)).startsWith('bound ') &&
    getUnboundName(name) === '' &&
    hasConstructSlot(value)
  );
}

/**
 * Detects whether the passed `value` is the bound variant
 * of another function type.
 * On that account a sophisticated guess got implemented,
 * which is considered to be more than just reliable but
 * also not entirely bulletproof.
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
 * This method is considered helpful and **safe**.
 *
 * @param value{any}
 * @returns {boolean}
 *  A boolean value which indicates whether the tested type
 *  is a bound function.
 */
export function isBound(value) {
  return isFunction(value) && getFunctionName(value).startsWith('bound ');
  // return isFunction(value) && (/^bound\s+/).test(getFunctionName(value));
}

/**
 * Detects whether the passed `value` is the bound variant
 * of another but **unnamed** function type.
 * On that account a sophisticated guess got implemented,
 * which is considered to be more than just reliable but
 * also not entirely bulletproof.
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
 * This method is considered helpful and **safe**.
 *
 * @param value{any}
 * @returns {boolean}
 *  A boolean value which indicates whether the tested type is
 *  the bound variant of another but **unnamed** function type.
 */
export function isBoundUnnamed(value) {
  // implementation based on already tested functionality.
  return isBound(value) && getUnboundName(getFunctionName(value)) === '';

  // // the most straightforward implementation.
  // return isFunction(value) && /^(?:bound )+$/.test(getFunctionName(value));
}

// export function getBindingCount(value) {
//   return isFunction(value)
//     ? getFunctionName(value).split('bound ').slice(1).length
//     : -1;
// }
