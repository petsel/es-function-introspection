import { callableBuiltInConstructors } from '../config';

import {
  getFunctionName,
  getUnboundName,
  getFunctionSignature,
  hasWritablePrototype,
} from '../utility';

import { isFunction, isGeneratorType } from './isFunction';
import { isConstructable } from './isConstructable';

//
//  +-------------------------------+-------------------------+---------------------+-------------+
//  |                               | the truth (almost)      |                     | reality...  |
//  |                               |                         |                     |             |
//  |                               | is constructable        | writable prototype  | is callable |
//  +-------------------------------+-------------------------+---------------------+-------------+
//  |                               | always same bound value |               bound |             |
//  |                               |                         |                     |             |
//  | arrowFunctionExpression       | false                   | undefined undefined | true        |
//  | asyncArrowFunctionExpression  | false                   | undefined undefined | true        |
//  | asyncFunctionStatement        | false                   | undefined undefined | true        |
//  |                               |                         |                     |             |
//  | asyncGeneratorStatement       | false (but should be)   | true      undefined | true        |
//  | generatorStatement            | false (but should be)   | true      undefined | true        |
//  |                               |                         |                     |             |
//  | functionStatement             | true                    | true      undefined | true        |
//  | namedFunctionExpression       | true                    | true      undefined | true        |
//  |                               |                         |                     |             |
//  | applicator    (new Applicator)| true                    | true      undefined | true        |
//  |                               |                         |                     |             |
//  | Applicator  (extends Function)| true                    | false     undefined | false       |
//  | ClassExpression               | true                    | false     undefined | false       |
//  |                               |                         |                     |             |
//  | URL                           | true                    | false     undefined | false       |
//  | EventTarget                   | true                    | false     undefined | false       |
//  |                               |                         |                     |             |
//  | Proxy                         | true                    | false     undefined | false       |
//  | Map                           | true                    | false     undefined | false       |
//  | Set                           | true                    | false     undefined | false       |
//  |                               |                         |                     |             |
//  |                    exceptions |                         |                     |             |
//  |                               |                         |                     |             |
//  |                  (non newable)|                         |                     |             |
//  | Symbol                        | true                    | false     undefined | true        |   A
//  | BigInt                        | true                    | false     undefined | true        |   L
//  |                (type coercion)|                         |                     |             |   W
//  | Boolean                       | true                    | false     undefined | true        |   A
//  | Number                        | true                    | false     undefined | true        |   Y
//  | String                        | true                    | false     undefined | true        |   S
//  | Date                          | true                    | false     undefined | true        |
//  | Object                        | true                    | false     undefined | true        |   C
//  |         (always instantiating)|                         |                     |             |   A
//  | Function                      | true                    | false     undefined | true        |   L
//  | Object                        | true                    | false     undefined | true        |   L
//  | Array                         | true                    | false     undefined | true        |   A
//  | RegExp                        | true                    | false     undefined | true        |   B
//  | Error                         | true                    | false     undefined | true        |   L
//  | AggregateError                | true                    | false     undefined | true        |   E
//  | EvalError                     | true                    | false     undefined | true        |
//  | RangeError                    | true                    | false     undefined | true        |   T
//  | ReferenceError                | true                    | false     undefined | true        |   Y
//  | SyntaxError                   | true                    | false     undefined | true        |   P
//  | TypeError                     | true                    | false     undefined | true        |   E
//  | URIError                      | true                    | false     undefined | true        |   S
//  +-------------------------------+-------------------------+---------------------+-------------+
//

// const callableBuiltInConstructorNames = new Set(
//   [...callableBuiltInConstructors].map((fct) => getFunctionName(fct))
// );
//
// // module specific utility/helper functionality
//
// function isCoveredByCallableBuiltInConstructorName(name) {
//   // - reliable as long as carefully maintained.
//   //
//   // - takes care of core language features which
//   //   most probably hardly will be run into, but
//   //   would be annoying, if not covered.
//   return callableBuiltInConstructorNames.has(name);
// }

function isCoveredByCallableBuiltInConstructor(fct) {
  // - reliable as long as carefully maintained.
  //
  // - takes care of core language features which
  //   most probably hardly will be run into, but
  //   would be annoying, if not covered.
  return callableBuiltInConstructors.has(fct);
}

function doesMatchClassNamingConvention(name) {
  // - more hinting than even lucky guessing ...
  //
  // - ... due to depending on the "first uppercase letter" naming
  //   convention ... and therefore being very much trusting.
  // - thus being mostly a strong hint but never bulletproof
  //   for it obviously fails for e.g. any unnamed class.
  return /^\p{Lu}/u.test(name);
}

/**
 * @module isCallable
 * @typicalname Function.isCallable
 */

/**
 * Tries to come up with a pure heuristic based result
 * about whether the passed possibly callable `value`
 * is callable without invoking its `[[call]]` slot,
 * and not by e.g. a `try...catch` wrapper approach.
 *
 * It will throw a `RangeError` for any value which is
 * a bound variant of either an unnamed ES3 function or
 * an unnamed class constructor because valid callability
 * detection of such a value is beyond this introspection
 * function's range.
 *
 * Thus, in order to actively prevent raising errors,
 * this method has to be used with `isBoundUnnamed`
 * as a guard.
 *
 * This method is considered helpful and **reliable**.
 *
 * @param value{any}
 * @returns {boolean}
 *  A boolean value which indicates whether the tested
 *  type can be invoked with the call/`()`-operator.
 * @throws {RangeError}
 *  Throws a `RangeError` for passed values which are
 *  bound variants of either unnamed ES3 functions or
 *  unnamed class constructors because valid callability
 *  detection of such values is beyond this introspection
 *  function's range.
 */
export function isCallable(value) {
  // - guard ... class constructor functions can not be simply invoked.
  let canBeCalled =
    isFunction(value) && !getFunctionSignature(value).startsWith('class ');

  // - the above condition already PREVENTS the entering of ...
  //    - UNBOUND class constructors (either named or unnamed).

  // - The next following constructable detection reveals the truth,
  //   regardless of dealing with either bound or unbound functions.
  // - "Any function type which "does not construct" is callable".
  // - But since the above rule of thumb by choice does not apply to
  //   any kind of generator function, the exception which was built
  //   into `isConstructable` now has to be explicitly targeted.

  if (canBeCalled && isConstructable(value) && !isGeneratorType(value)) {
    // - the above condition furthermore PREVENTS the entering of ...
    //    - arrow functions (either bound or unbound, either named or unnamed),
    //    - async functions (either bound or unbound, either named or unnamed),
    //    - generators (either bound or unbound, either named or unnamed).
    const fctName = getFunctionName(value);

    if (fctName === 'bound ') {
      // is bound unnamed function type.

      throw new RangeError(
        "Valid callability detection of bound variants of either unnamed ES3 functions or unnamed class constructors is beyond this introspection's range.",
      );
    } else if (fctName.startsWith('bound ')) {
      // is bound named function type.

      const unboundName = getUnboundName(fctName);
      value = globalThis?.[unboundName] ?? null;

      canBeCalled =
        // (value !== null && isCoveredByCallableBuiltInConstructorName(unboundName)) ||
        (value !== null && isCoveredByCallableBuiltInConstructor(value)) ||
        !doesMatchClassNamingConvention(unboundName);
    } else {
      // is unbound function type.

      canBeCalled =
        hasWritablePrototype(value) ||
        isCoveredByCallableBuiltInConstructor(value);
    }
  }
  return canBeCalled;
}
